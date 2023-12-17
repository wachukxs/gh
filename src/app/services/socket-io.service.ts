import { BreakpointObserver } from '@angular/cdk/layout'
import { HttpClient } from '@angular/common/http'
import { Injectable, OnInit } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { select, Store } from '@ngrx/store'
import { io, Socket } from 'socket.io-client'
import { environment } from 'src/environments/environment'
import { AppState } from '../ngrx-store/app.state'
import { selectFeatureCorpMember } from '../ngrx-store/selectors/corp.selectors'
import { BaseService } from './base.service'
import { CorpMemberState } from '../../app/ngrx-store/app.state'

@Injectable({
    providedIn: 'root',
})
export class SocketIoService extends BaseService implements OnInit {
    // https://deepinder.me/creating-a-real-time-app-with-angular-8-and-socket-io-with-nodejs

    socket!: Socket
    corpMember!: CorpMemberState

    constructor(
        http: HttpClient,
        snackBar: MatSnackBar,
        breakpointObserver: BreakpointObserver,
        store: Store<AppState>,
    ) {
        super(snackBar, breakpointObserver, store)

        this._store.pipe(select('corper')).subscribe({
            next: (value) => {
                console.log('eagles', value)
                this.corpMember = value
            },
        })
    }

    ngOnInit(): void {
        console.log('connecting socket...')
        this.socket = io(`${environment.basehost}`, {
            query: {
                state_code: this.corpMember.state_code,
            },
        })
        this.socket.emit('hi', 'Hey from FE.')
        this.socket.emit('boardcast message', 'Hi. New Connection.')

        this.socket.on('boardcast message', (payload, callback) => {
          console.log('payload, callback', payload, callback);
          
        })
    }

    receivedNewAccommodation() {
        // will this ever by used?
    }

    ngOnDestroy() {
        if (this.socket) {
            this.socket.disconnect()
        }
    }
}
