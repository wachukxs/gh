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

/** Your events enum */
export enum IOEventName {
    HI = "hi",
    NEW_SALE = "new_sale",
    NEW_ACCOMMODATION = "new_accommodation",
    BROADCAST_MESSAGE = "broadcast_message"
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
        http: HttpClient,
        snackBar: MatSnackBar,
        breakpointObserver: BreakpointObserver,
        store: Store<AppState>,
    ) {
        // super(snackBar, breakpointObserver, store)

        // this._store.pipe(select('corper')).subscribe({
        //     next: (value) => {
        //         // console.log('eagles', value)
        //         this.corpMember = value
        //     },
        // })

        // `${environment.basehost}${environment.CORP_MEMBER_SOCKET_ENDPOINT}`
        this.socket = io('http://localhost:3051/', {
            transports: ['websocket', 'polling']
        })

        // Optional: You can handle events, errors, etc.
        this.socket.on('connect', () => {
            console.log('Connected to Socket.IO');
        });
    
        this.socket.on('disconnect', () => {
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
