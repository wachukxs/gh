import { BreakpointObserver } from '@angular/cdk/layout'
import { HttpClient } from '@angular/common/http'
import { Injectable, OnInit } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { select, Store } from '@ngrx/store'
import { environment } from 'src/environments/environment'
import { AppState } from '../ngrx-store/app.state'
import { selectFeatureCorpMember } from '../ngrx-store/selectors/corp.selectors'
import { BaseService } from './base.service'
import { CorpMemberState } from '../../app/ngrx-store/app.state'
import { io, Socket } from 'socket.io-client'
import { map } from 'rxjs/operators'
import { Observable, Observer } from 'rxjs'

/** Your events enum, should also be same on server */
export enum IOEventName {
    HI = "hi",
    NEW_SALE = "new_sale",
    NEW_ACCOMMODATION = "new_accommodation",
    BROADCAST_MESSAGE = "broadcast_message",
    CONNECT = "connect",
    CONNECTION = "connection",
    DISCONNECT = "disconnect",
}

/**
 * TODO: when we'd be creating a new service for a different namespace,
 * We'll reuse an existing socket connection or "manager" https://socket.io/docs/v4/client-options/#multiplex
 */
export enum IOEventRoutes {
    BASE = "/",
    CHAT = "/chat",
    MAP = "/map",
}

@Injectable({
    providedIn: 'root',
})
export class SocketIoService 
// extends BaseService 
{
    // TODO: To Read: https://github.com/ShemiNechmad/websockets/blob/master/src/app/websocket.service.ts
    // https://deepinder.me/creating-a-real-time-app-with-angular-8-and-socket-io-with-nodejs

    corpMember!: CorpMemberState

    private socket: Socket

    constructor(
        public http: HttpClient,
        public store: Store<AppState>,
    ) {

        this.store.pipe(select('corper')).subscribe({
            next: (value) => {
                this.corpMember = value
            },
        })

        // TODO: get last post.

        // `${environment.basehost}${environment.CORP_MEMBER_SOCKET_ENDPOINT}`
        this.socket = io(environment.basehost, {
            transports: ['websocket', 'polling'],
            query: {
                state_code: this.corpMember.state_code
            }
        })

        // Optional: You can handle events, errors, etc.
        this.socket.on(IOEventName.CONNECT, () => {
            console.log('Connected to Socket.IO');
        });

        this.socket.on(IOEventName.CONNECTION, (_s: any) => {
            console.log('Connected to BACKEND...');

            // _s.join(this.corpMember?.state_code?.substring(0, 2))
            console.log('joined...', this.corpMember?.state_code?.substring(0, 2));
        });
    
        this.socket.on(IOEventName.DISCONNECT, () => {
            // TODO: is it possible to prevent logging connection errors??
            console.log('Disconnected from Socket.IO');
        });
    }

    public onEvent<T>(event: IOEventName): Observable<T | Array<T>> {
        return new Observable<T>((observer) => {
            this.socket.on(event, (data: T) => observer.next(data))

            // Optional: Clean up on unsubscribe
            return () => this.socket.off(event);
        })
    }

    public sendEvent(eventName: IOEventName, data: any) {
        console.log('trying sendEvent');
        
        this.socket.emit(eventName, data, (v: any) => {
            // show notification - confirmation from server.
            console.log('some ack from server', v);
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
            console.log('ack from server');
        })
    }

    receivedNewAccommodation() {
    }

    sendNewSale() {}
}
