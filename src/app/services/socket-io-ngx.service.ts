import { Injectable } from '@angular/core'
import { Socket, SocketIoConfig } from 'ngx-socket-io'
import { BaseService } from './base.service'
import { BreakpointObserver } from '@angular/cdk/layout'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Store } from '@ngrx/store'
import { AppState } from '../ngrx-store/app.state'
import { Observable } from 'rxjs'

/**
 * Deferring usage of this service.
 */
@Injectable({
    providedIn: 'root',
})
export class SocketIoNgxService 
// extends BaseService 
{
    constructor(
        snackBar: MatSnackBar,
        breakpointObserver: BreakpointObserver,
        store: Store<AppState>,
        private socket: Socket,
    ) {
        // super(snackBar, breakpointObserver, store)

        // ${environment.basehost}${environment.CORP_MEMBER_SOCKET_ENDPOINT}

        // this.socket.connect((err) => {
        //   console.log('err conn', err);
          
        // })

        // this.socket.fromEvent<any>('connect').subscribe((data) => {
        //     console.log('socket.io connected??', data)
        // })

        // console.log('?? socket-ngx - io', this.socket)

    }

    testSocketConnection() {
        console.log('trying to send')
        this.socket.emit('hi', 'Hey from FE.')
        this.socket.emit('broadcast_message', 'Hi. New Connection.')
    }

    test2(): Observable<any> {
        return this.socket.fromEvent<any>('broadcast_message')
    }

    test1(): Observable<any> {
        return this.socket.fromEvent<any>('hi')
    }

    // should this be in a service? - no, doesn't implement OnInit
    ngOnDestroy() {
        this.socket?.disconnect()
    }
}
