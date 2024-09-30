/** Your events enum, should also be same on server */
export enum IOEventName {
    HI = 'hi',
    NEW_SALE = 'new_sale',
    NEW_ACCOMMODATION = 'new_accommodation',
    BROADCAST_MESSAGE = 'broadcast_message',
    CHAT_MESSAGE = 'chat_message',
    CONNECT = 'connect',
    ERROR = 'error',
    CONNECT_ERROR = 'connect_error',
    DISCONNECT = 'disconnect',
}

/**
 * TODO: when we'd be creating a new service for a different namespace,
 * ~We'll reuse an existing socket connection or "manager" https://socket.io/docs/v4/client-options/#multiplex~
 */
export enum IOEventRoutes {
    BASE = '/',
    CHAT = '/chat',
    MAP = '/map',
}
