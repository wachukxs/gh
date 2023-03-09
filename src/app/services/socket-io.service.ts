import { Injectable, OnInit } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService implements OnInit { // https://deepinder.me/creating-a-real-time-app-with-angular-8-and-socket-io-with-nodejs

  socket: Socket;
  constructor() {
    console.log('connecting socket...');
    
    this.socket = io(`${environment.basehost}`); // ${environment.SOCKET_ENDPOINT}
    this.socket.emit('hi', 'Hey from FE.');
  }

  ngOnInit(): void {
      this.socket.emit('boardcast message', "Hi. New Connection.")
  }

  receivedNewAccommodation() { // will this ever by used?

  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect()
    }
  }
}
