import { Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { CallerService } from '../services/caller.service'
import { AppMessages, AppState } from '../ngrx-store/app.state'
import { Store, select } from '@ngrx/store'
import { selectFeatureMessages } from '../ngrx-store/selectors/corp.selectors'
import { newChatMessage, newMessage } from '../ngrx-store/actions/corp-member.actions'
import { IOEventName, SocketIoChatNamespaceService } from '../services/socket-io.chat-ns.service'

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
        private callerService: CallerService) {}

    testChats = ['Marie Barbossa', 'Sarie Fada', 'Lukman Sally']
    appStateChats: AppMessages = new Map()
    
    // Is a one item array of the selected chat.
    selectedChat: FormControl = new FormControl()
    randomNumbers: Array<string> = Array.from(
        'af2389dsjfas3433fjdsakfal34335klsfdas',
    )
    chatMessage = new FormControl({ value: '', disabled: false })

    ngOnInit() {
        console.log('?who?', this.callerService.corpMember.state_code);
        
        this.store
        .pipe(
            select(selectFeatureMessages), // or select('messages')
        )
        .subscribe({
            next: (value: any) => {
                console.log('new appStateChats', value);
                this.appStateChats = value
                // TODO: If it's a new chat, we need to select that new chat, and open it.
                // How do we know it's a new chat?
            },
        })
        const chatWithStateCode = this.route.snapshot.queryParamMap.get('s');
        console.log('chatWithStateCode?', chatWithStateCode);
        /**
         * TODO: Fetch the chat with this state code and remove it from the url.
         * Maybe move this to a route resolver.
         * 
         * 0. If state code is invalid, show error message.
         * 1. Next, check if chat is in state, then bring it to the top.
         * 2. If it's a new chat, create new chat at the top.
         */
        
        if (chatWithStateCode && !this.callerService.state_code_regex.test(chatWithStateCode)) {
            
        }

        // TODO: if no previous chat.
        // TODO: fetch the chat details. (get the new chat name from the sale post. Pick it from the state.) so there's no extra call.
        this.selectedChat?.valueChanges.subscribe((value) => {
            console.log('selected chat...', value)
        })

        this.socketIoChatNsService
        .onEvent(IOEventName.CHAT_MESSAGE)
        .subscribe((data: any) => {
            console.log('new chat message data:', data)

            // send to the app state.
            this.store.dispatch(newChatMessage(data))
        })
    }

    sendMessage() {
        console.log('will send', this.chatMessage.value);

        if (!this.chatMessage.value) {
            this.callerService.showNotification('Please enter a message')
            return
        }

        // should be id?
        const _msg = {
            message: this.chatMessage.value,
            message_to: this.selectedChat.value?.[0],
            message_from: this.callerService.corpMember.state_code,
            // room: window.crypto.randomUUID(), // https://stackoverflow.com/a/27747377/9259701
        }
        // Then clear the input after sending message.
        // Use websockets...

        // should be passing an optional callback (will show notification - message sent?)
        this.socketIoChatNsService.sendChatMessage(_msg)

        // clear message after sending...
        this.chatMessage.setValue('')
        
    }
}
