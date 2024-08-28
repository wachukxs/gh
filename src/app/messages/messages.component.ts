import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormControl } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { CallerService } from '../services/caller.service'
import { AppMessages, AppState } from '../ngrx-store/app.state'
import { Store, select } from '@ngrx/store'
import { selectFeatureMessages } from '../ngrx-store/selectors/corp.selectors'
import {
    initializeMessages,
    newChatMessage,
    newMessage,
} from '../ngrx-store/actions/corp-member.actions'
import {
    IOEventName,
    SocketIoChatNamespaceService,
} from '../services/socket-io.chat-ns.service'
import { HttpResponse, HttpStatusCode } from '@angular/common/http'
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/overlay';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { BehaviorSubject, Observable, Subscription } from 'rxjs'
import { filter } from 'rxjs/operators'
import { CollectionViewer, DataSource } from '@angular/cdk/collections'

/**
 * TODO: we need a route guard to fetch all the messages;
 * And get the details of the new person they want to chat with.
 */
@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit, AfterViewInit {
    @ViewChild('innerChatBox', { read: ElementRef, static: true }) 
    innerChatBoxElement!: ElementRef

    @ViewChild(CdkVirtualScrollViewport, {static: false})
    // @ViewChild('scrollViewPort', {static: false})
    public viewPort?: CdkVirtualScrollViewport;

    // public viewPort?: CdkVirtualScrollViewport;

    // @ViewChild(CdkVirtualScrollViewport)
    // set viewPort (v: CdkVirtualScrollViewport) {
    //     setTimeout(() => {
    //         this.viewPort = v;
    //         // console.log('will scroll v2', v?.getDataLength());
    //     }, 0);
    // }

    state_code: string = this.callerService.corpMember.state_code
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private socketIoChatNamespaceService: SocketIoChatNamespaceService,
        public store: Store<AppState>,
        public callerService: CallerService,
    ) {}

    testChats = ['Marie Barbossa', 'Sarie Fada', 'Lukman Sally']
    appStateChats: AppMessages = new Map()

    selectedChatMessages: Array<any> = []

    // Is a one item array of the selected chat.
    selectedChat: FormControl = new FormControl(null)
    randomNumbers: Array<string> = Array.from(
        'af2389dsjfas3433fjdsakfal34335klsfdas',
    )
    chatMessage = new FormControl({ value: '', disabled: false })

    ds?: MyDataSource;

    ngOnInit() {
        console.log('?who?', this.callerService.corpMember.state_code)

        this.route.data.subscribe(({res}) => {
            // do something with your resolved data ...
            console.log('messages resolved data', res);
            
            if (res.status === HttpStatusCode.Ok) {
                this.store.dispatch(initializeMessages(res.body.results))
            }
          })

        this.store
            .pipe(
                select(selectFeatureMessages), // or select('messages')
            )
            .subscribe({
                next: (value: any) => {
                    console.log('new appStateChats', value)
                    this.appStateChats = value
                },
            })
        // const chatWithStateCode = this.route.snapshot.queryParamMap.get('s');

        // will only emit if it's a message in the current room.
        this.socketIoChatNamespaceService.onEvent(IOEventName.CHAT_MESSAGE)
        .pipe(filter((chat: any) => chat?.room === this.selectedChat.value?.[0]))
        .subscribe((data) => {
            console.log('new room chat???', data);
            // ???
            this.updateChatMessages()
        })


        // TODO: if no previous chat.
        // TODO: fetch the chat details. (get the new chat name from the sale post. Pick it from the state.) so there's no extra call.
        this.selectedChat?.valueChanges.subscribe((value) => {
            console.log('selected chat...', value?.[0])

            this.initializeChatMessages()
        })

        const testMsg = {
            "_time_read": "Not read yet.",
            "age": "a month ago",
            "id": 1,
            "room": "b021304c-3ae7-4a89-b638-8a8cf9f9244c",
            "message": "Hi",
            "message_from": 3,
            "message_to": 2,
            "time_read": null,
            "message_sent": false,
            "created_at": "2024-07-07T23:55:34.000Z",
            "updated_at": "2024-07-07T23:55:34.000Z",
            "FromCorpMember": {
                "state_code": "AB/23C/1007",
                "first_name": "Bush",
                "nickname": null,
                "id": 3
            },
            "ToCorpMember": {
                "state_code": "AB/22A/1234",
                "first_name": "George",
                "nickname": null,
                "id": 2
            }
        }

        this.socketIoChatNamespaceService.socket.on(IOEventName.ERROR, (data) => {
            console.log('failed to send new chat message:', data)
            this.callerService.showNotification('Failed to deliver message')

            // Restore the message that failed to send.
            this.chatMessage.setValue(data?.message)
        })

        this.viewPort?.renderedRangeStream.subscribe((newValue) => {
            console.log('new renderedRangeStream value??', newValue)
        })
        
    }

    initializeChatMessages() {
        // TODO: If it's a new chat, we need to select that new chat, and open it.
        // How do we know it's a new chat?
        if (this.appStateChats.get(this.selectedChat.value?.[0])) {
            console.log('should update')
            this.ds = new MyDataSource([...this.appStateChats.get(this.selectedChat.value?.[0])!.texts])
        } else {
            this.ds = new MyDataSource([])
        }

        // then scroll
        this.scrollToBottomOfChatBox()
    }

    updateChatMessages() {
        // TODO: If it's a new chat, we need to select that new chat, and open it.
        // How do we know it's a new chat?

        // no need for this if check - overkill
        if (this.appStateChats.get(this.selectedChat.value?.[0])) {
            console.log('should update')
            this.ds?.loadMessages(this.appStateChats.get(this.selectedChat.value?.[0])!.texts)
        } else {
            this.ds?.loadMessages([])
        }

        // then scroll
        this.scrollToBottomOfChatBox()
    }

    ngAfterViewInit() {
        console.log('view port', this.viewPort);
        
        // console.log('on after view init', this.innerChatBoxElement);
    }

    // https://stackoverflow.com/a/45367387/9259701
    scrollToBottomOfChatBox() {
        console.log('will scroll', this.viewPort?.getDataLength()); // this.innerChatBoxElement.nativeElement.children.length
        
        // this.viewPort?.scrollToIndex(this.viewPort?.getDataLength(), 'smooth')

        this.viewPort?.scrollTo({
            bottom: 0,
            behavior: 'smooth'
        })

        // console.log('?inner', this.innerChatBoxElement.nativeElement.children);
        if (this.innerChatBoxElement.nativeElement.children?.length > 1) {
            // this.innerChatBoxElement.nativeElement.children[0].scrollTop = this.innerChatBoxElement.nativeElement?.children?.[0]?.scrollHeight
            
            // or

            // this.innerChatBoxElement?.nativeElement?.children?.[0]?.scrollTo({
            //     top: this.innerChatBoxElement.nativeElement?.children?.[0]?.scrollHeight,
            //     left: 0,
            //     behavior: 'smooth' // should we use a smooth scroll?
            // })
        }

    }

    sendMessage() {
        console.log('will send', this.chatMessage.value)

        if (!this.chatMessage.value) {
            this.callerService.showNotification('Please enter a message')
            return
        }

        /**
         * If it's a new chat, we take recipient_id, else ...
         */

        const selectedRoom = this.selectedChat.value?.[0]

        let messageTo =
            this.appStateChats.get(selectedRoom)?.recipient_id !==
            this.callerService.corpMember.id
                ? this.appStateChats.get(selectedRoom)?.recipient_id
                : this.appStateChats.get(selectedRoom)?.initiator_id
    
        // if it's not a new chat
        if (!messageTo) {
            const _chat = this.appStateChats.get(selectedRoom)?.texts?.[0]
            messageTo = _chat?.message_from === this.callerService.corpMember.id
                ? _chat?.ToCorpMember.id
                : _chat?.FromCorpMember.id
        }
        
        const _msg = {
            message: this.chatMessage.value,
            message_to: messageTo,
            message_from: this.callerService.corpMember.id,
            room: selectedRoom ?? this.appStateChats.get(selectedRoom)?.room, // window.crypto.randomUUID(), // https://stackoverflow.com/a/27747377/9259701
        }
        // Then clear the input after sending message.
        // Use web sockets...

        // should be passing an optional callback (will show notification - message sent?)
        this.socketIoChatNamespaceService.sendChatMessage(_msg)

        // clear message after sending...
        this.chatMessage.setValue('')
    }

    /**
     * need to optimize this. - end goal is not to use it.
     * @param chat - should be AppMessageValue?
     */
    getChatDisplayName(chat: any): string {
        // console.log('looking for name', chat)
        // whoever sent the first message is the room creator ~This is just to get a working draft/version~
        if (Array.isArray(chat.value?.texts) && chat.value?.texts?.[0]) {
            const _chat = chat.value?.texts?.[0]
            return _chat.message_from === this.callerService.corpMember.id
                ? _chat.ToCorpMember.first_name
                : _chat.FromCorpMember.first_name
        }

        return chat?.value?.initiator_id === this.callerService.corpMember.id
            ? chat?.value?.recipient_name
            : chat?.value?.initiator_name
    }

    ngOnDestroy() {
        this.socketIoChatNamespaceService.destroy()
    }
}


/**
 * Helpful links
 * 1. https://github.com/angular/components/issues/6036#issue-245548942
 * 2. Custom data source https://stackblitz.com/angular/lvmmplvepem?file=app%2Fcdk-virtual-scroll-data-source-example.ts
 * 3. Sample code https://github.com/angular/components/pull/5766/files
 * 
 * Should ideally have .asObservable()
 */
export class MyDataSource extends DataSource<object | undefined> {
    
    constructor(
        private messages: Array<object> = []
    ) {
        super()
    }
    
    private dataStream = new BehaviorSubject<(object | undefined)[]>(this.messages);
  
    /**
     * called once by the cdkScrollable to get the observable that will contain the data
     * @param collectionViewer 
     * @returns 
     */
    connect(collectionViewer: CollectionViewer): Observable<(object | undefined)[]> {
      return this.dataStream;
    }

    loadMessages(data: Array<object>): void {
        this.dataStream.next(data)
    }
  
    disconnect(): void {
      this.dataStream.complete()
    }
  }
