import { Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

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
    constructor(
        private route: ActivatedRoute,
        private router: Router  ) {}

    testChats = ['Marie Barbossa', 'Sarie Fada', 'Lukman Sally']
    selectedChat: FormControl = new FormControl('')
    randomNumbers: Array<string> = Array.from(
        'af2389dsjfas3433fjdsakfal34335klsfdas',
    )
    chatMessage = new FormControl({ value: '', disabled: false })

    ngOnInit() {
        const chatWithStateCode = this.route.snapshot.queryParamMap.get('s');
        console.log('chatWithStateCode?', chatWithStateCode);
        /**
         * TODO: Fetch the chat with this state code and remove it from the url.
         * Maybe move this to a route resolver.
         * 
         * 1. Next, check if chat is in state, then bring it to the top.
         * 2. If it's a new chat, create new chat at the top.
         */
        
        this.selectedChat?.valueChanges.subscribe((value) => {
            console.log('selected chat...', value)
        })
    }

    sendMessage() {}
}