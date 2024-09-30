import { BreakpointObserver } from '@angular/cdk/layout'
import { HttpClient } from '@angular/common/http'
import { Injectable, OnInit } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { select, Store } from '@ngrx/store'
import { environment } from 'src/environments/environment'
import { AppState } from '../ngrx-store/app.state'
import { selectFeatureCorpMember } from '../ngrx-store/selectors/corp.selectors'
import { BaseService } from './base.service'
import { CorpMemberState } from '../ngrx-store/app.state'
import { io, Socket } from 'socket.io-client'
import { map } from 'rxjs/operators'
import { Observable, Observer } from 'rxjs'
import { newChatMessage } from '../ngrx-store/actions/corp-member.actions'
import { IOEventName, IOEventRoutes } from '../utils/types'

@Injectable({
    providedIn: 'root',
})
// extends BaseService
export class SocketIoChatNamespaceService {
    // TODO: To Read: https://github.com/ShemiNechmad/websockets/blob/master/src/app/websocket.service.ts
    // https://deepinder.me/creating-a-real-time-app-with-angular-8-and-socket-io-with-nodejs

    corpMember!: CorpMemberState

    socket: Socket // private?

    constructor(public http: HttpClient, public store: Store<AppState>) {
        this.store.pipe(select('corper')).subscribe({
            next: (value) => {
                this.corpMember = value
            },
        })

        // TODO: get last post.

        this.socket = io(environment.basehost + IOEventRoutes.CHAT, {
            transports: ['websocket', 'polling'],
            query: {
                state_code: this.corpMember.state_code,
                id: this.corpMember.id,
            },
        })

        // Optional: You can handle events, errors, etc.
        this.socket.on(IOEventName.CONNECT, () => {
            console.log('Connected to Socket.IO/chat')
        })

        this.socket.on(IOEventName.CONNECT_ERROR, (error) => {
            if (this.socket.active) {
                // TODO: show a message.
                // temporary failure, the socket will automatically try to reconnect
            } else {
                // the connection was denied by the server
                // in that case, `socket.connect()` must be manually called in order to reconnect
                
            }
            console.log(error.message)
        })

        this.socket.on(IOEventName.DISCONNECT, () => {
            // TODO: is it possible to prevent logging connection errors??
            console.log('Disconnected from Socket.IO/chat')
            // this.socket.removeAllListeners()
        })

        // force emit an event to force connection
        this.tester()

        this.socket.on(
            IOEventName.CHAT_MESSAGE,
            (data) => {
                console.log('##new chat:', data)
                this.store.dispatch(newChatMessage(data))
            },
        )
    }

    /**
     * @ignore - has bug
     *
     * you need to call this and pass the name of the event you want to listen to.
     * This has a bug where the event is emitted twice. will fix later
     * @param event
     * @returns
     */
    public onEvent<T>(event: IOEventName): Observable<T | Array<T>> {
        return new Observable<T>((observer) => {
            this.socket.on(event, (data: T) => observer.next(data))

            // Optional: Clean up on unsubscribe
            return () => {
                // this.socket.off(event)
                // this.socket.disconnect()
            }
        })
    }

    /**
     * May use this to send a custom event???
     */
    public sendEvent(eventName: IOEventName, data: any) {
        console.log('trying sendEvent')

        if (this.socket.disconnected) {
            this.socket.connect()
            // todo: can we wait till after connection??
        }

        this.socket.emit(eventName, data, (v: any) => {
            // show notification - confirmation from server.
            console.log('some ack from server', v)
        })
    }

    /**
     * TODO: maybe pass the callback as an optional argument here.
     * then call it in a different component.
     * @param data any
     */
    public sendChatMessage(data: {
        message: string
        message_to?: number
        message_from: number
        room?: string
    }) {
        console.log('trying to send chat message')

        if (this.socket.disconnected) {
            console.log('io was disconnected');
            
            this.socket.connect()
            // TODO: can we wait till after connection??
        }

        this.socket.emit(IOEventName.CHAT_MESSAGE, data, (v: any) => {
            // show notification - confirmation from server.
            console.log('got confirmation from serve - msg got', v)
        })
    }

    public destroy() {
        if (this.socket) {
            this.socket.removeAllListeners()
            this.socket.close()
            // this.socket = undefined;
        }
    }

    tester() {
        this.socket.emit('hi', 'TEST send DATA', (v: any) => {
            console.log('ack from server')
        })
    }
}
