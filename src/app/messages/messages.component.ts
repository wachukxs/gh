import { Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { CallerService } from '../services/caller.service'
import { AppMessages, AppState } from '../ngrx-store/app.state'
import { Store, select } from '@ngrx/store'
import { selectFeatureMessages } from '../ngrx-store/selectors/corp.selectors'
import {
    newChatMessage,
    newMessage,
} from '../ngrx-store/actions/corp-member.actions'
import {
    IOEventName,
    SocketIoChatNamespaceService,
} from '../services/socket-io.chat-ns.service'
import { HttpResponse, HttpStatusCode } from '@angular/common/http'

/**
 * TODO: we need a route guard to fetch all the messages;
 * And get the details of the new person they want to chat with.
 */
@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
    state_code: string = this.callerService.corpMember.state_code
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private socketIoChatNsService: SocketIoChatNamespaceService,
        public store: Store<AppState>,
        public callerService: CallerService,
    ) {}

    testChats = ['Marie Barbossa', 'Sarie Fada', 'Lukman Sally']
    appStateChats: AppMessages = new Map()

    // Is a one item array of the selected chat.
    selectedChat: FormControl = new FormControl()
    randomNumbers: Array<string> = Array.from(
        'af2389dsjfas3433fjdsakfal34335klsfdas',
    )
    chatMessage = new FormControl({ value: '', disabled: false })

    ngOnInit() {
        console.log('?who?', this.callerService.corpMember.state_code)

        this.store
            .pipe(
                select(selectFeatureMessages), // or select('messages')
            )
            .subscribe({
                next: (value: any) => {
                    console.log('new appStateChats', value)
                    this.appStateChats = value
                    // TODO: If it's a new chat, we need to select that new chat, and open it.
                    // How do we know it's a new chat?
                },
            })
        // const chatWithStateCode = this.route.snapshot.queryParamMap.get('s');

        // TODO: if no previous chat.
        // TODO: fetch the chat details. (get the new chat name from the sale post. Pick it from the state.) so there's no extra call.
        this.selectedChat?.valueChanges.subscribe((value) => {
            console.log('selected chat...', value)
        })

        this.socketIoChatNsService.socket.on(IOEventName.ERROR, (data) => {
            console.log('failed to send new chat message:', data)
            this.callerService.showNotification('Failed to deliver message')

            // Restore the message that failed to send.
            this.chatMessage.setValue(data?.message)
        })
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
        this.socketIoChatNsService.sendChatMessage(_msg)

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
        this.socketIoChatNsService.destroy()
    }
}
