import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormControl } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { CallerService } from '../services/caller.service'
import { AppMessages, AppState, ChatMessage } from '../ngrx-store/app.state'
import { Store, select } from '@ngrx/store'
import { selectFeatureMessages } from '../ngrx-store/selectors/corp.selectors'
import {
    initializeMessages,
    newChatMessage,
    newMessage,
    updateMessages,
} from '../ngrx-store/actions/corp-member.actions'
import {
    SocketIoChatNamespaceService,
} from '../services/socket-io.chat-ns.service'
import { HttpResponse, HttpStatusCode } from '@angular/common/http'
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/overlay';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs'
import { filter } from 'rxjs/operators'
import { CollectionViewer, DataSource } from '@angular/cdk/collections'
import { IOEventName } from '../utils/types'

/**
 * BUG
 * 1. Chatting with someone you already had a chat with starts a different new chat?
 * 2. Chatting with a new person doesn't start a new chat??
 *  */

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
    public viewPort?: CdkVirtualScrollViewport;

    @ViewChild('scroller', {read: ElementRef}) private scrollContainer!: ElementRef;

    // public viewPort?: CdkVirtualScrollViewport;

    // @ViewChild(CdkVirtualScrollViewport)
    // set viewPort (v: CdkVirtualScrollViewport) {
    //     setTimeout(() => {
    //         this.viewPort = v;
    //         // console.log('will scroll v2', v?.getDataLength());
    //     }, 0);
    // }

    state_code: string = this.callerService.corpMember.state_code
    isSendingMessage = false
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
                // should not initialize ... what if we are coming to start a new chat
                this.store.dispatch(updateMessages(res.body.results))
            }
          })

        this.store
            .pipe(
                select(selectFeatureMessages), // or select('messages')
            )
            .subscribe({
                next: (value: AppMessages) => {
                    console.log('new appStateChats', value)
                    this.appStateChats = value
                },
            })
        
        this.ds = new MyDataSource(this.store, this.selectedChat)

        this.ds.newDataUpdate.subscribe((value: any) => {
            this.scrollToBottomOfChatBox()
        })

        // const chatWithStateCode = this.route.snapshot.queryParamMap.get('s');


        // TODO: if no previous chat.
        // TODO: fetch the chat details. (get the new chat name from the sale post. Pick it from the state.) so there's no extra call.
        this.selectedChat?.valueChanges.subscribe((value) => {
            console.log('selected chat...', value?.[0])

            // TODO: scroll after view is done rendering or we're done showing all the messages.
            this.scrollToBottomOfChatBox()
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

        this.socketIoChatNamespaceService.socket.on(
            IOEventName.CHAT_MESSAGE,
            (data) => {
                console.log('##new chat:', data)
                this.store.dispatch(newChatMessage(data))
            },
        )
        
    }

    ngAfterViewInit() {
        
    }

    ngAfterViewChecked() {
        // only scroll when this child view in done initializing.
        // this.scrollToBottomOfChatBox()
    }

    // https://stackoverflow.com/a/45367387/9259701
    scrollToBottomOfChatBox() {

        // todo: only scroll when they're at the bottom of the page.

        // this.viewPort?.scrollTo({
        //     bottom: 0,
        //     behavior: 'smooth'
        // })

        // or

        // this.viewPort?.scrollToIndex(this.viewPort?.getDataLength() - 1, 'smooth')

        if (this.scrollContainer?.nativeElement) {
            console.log('will scroll.', this.scrollContainer?.nativeElement?.scrollHeight)
            // doesn't work
            // this.scrollContainer.nativeElement.scrollTop = this.scrollContainer?.nativeElement?.scrollHeight || 0;

            // this works sometimes... but not on the first try
            this.scrollContainer.nativeElement.scrollTo(0, this.scrollContainer?.nativeElement?.scrollHeight || 0)
            
            // (seems) this doesn't work
            // this.scrollContainer.nativeElement.scrollTo({ bottom: 0 })
        }

    }

    sendMessage() {
        
        if (!this.chatMessage.value) {
            this.callerService.showNotification('Please enter a message')
            return
        }
        console.log('will send', this.chatMessage.value)
        this.isSendingMessage = true

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

        this.isSendingMessage = false
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
    

    /**
     * idea from https://blog.angular-university.io/angular-material-data-table/
     */
    public newDataUpdate = new Subject()

    // kinda hate that this is duplicated
    private appMessage: AppMessages = new Map()
    constructor(
        public store: Store<AppState>,
        public selectedChat: FormControl
    ) {
        super()
    }
    
    private dataStream = new BehaviorSubject<ChatMessage[]>([]);
  
    /**
     * called once by the cdkScrollable to get the observable that will contain the data
     * @param collectionViewer 
     * @returns 
     */
    connect(collectionViewer: CollectionViewer): Observable<ChatMessage[]> {
        // could also be in constructor.
        this.selectedChat?.valueChanges.subscribe((value) => {
            console.log('new selected chat in ds')
            this.loadMessages()
        })

        // don't need this???
        this.store
        .pipe(
            select(selectFeatureMessages), // or select('messages')
        )
        .subscribe({
            next: (value: AppMessages) => {
                console.log('new appStateChats in ds')
                this.appMessage = value
                this.loadMessages()
            },
        })

        return this.dataStream;
    }

    private loadMessages(): void {
        // if there are new message, update the data stream
        if (this.selectedChat.value?.[0]
            && this.appMessage.has(this.selectedChat.value?.[0])
            && this.appMessage.get(this.selectedChat.value?.[0])!.texts.length > this.dataStream.getValue().length
        ) {
            this.dataStream.next(this.appMessage.get(this.selectedChat.value?.[0])!.texts)

            this.newDataUpdate.next(true)
        } else {
            this.dataStream.next([])
        }
    }
  
    disconnect(): void {
      this.dataStream.complete()
    }
  }
