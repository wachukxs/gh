import { Action, ActionReducer, createReducer, MetaReducer, on } from '@ngrx/store'
import {
    initializeMessages,
    newChatMessage,
    newFeedData,
    newMessage,
    profileUpdateSuccess,
    setCorpMemberProfileData,
    updateMessages,
} from '../actions/corp-member.actions'
import {
    AppState,
    CorpMemberState,
    FeedDataType,
    AppMessages,
    initialCorpMemberState,
    initialState,
    ChatMessage,
    AppMessageValue,
} from '../app.state'
import { selectFeatureMessages } from '../selectors/corp.selectors'

export const corpMemberReducer = createReducer(
    initialCorpMemberState, // or initialState.corper // initial state should be the corper from the whole app state
    on(setCorpMemberProfileData, (state: CorpMemberState, { data }) => ({
        ...data,
    })),

    /**
     * Update part of the corper state
     */
    on(profileUpdateSuccess, (state: CorpMemberState, { data }) => ({
        ...state,
        ...data,
    })),
)

export const feedReducer = createReducer(
    initialState.feed, // initial state should be the feed from the whole app state
    on(newFeedData, (state: Array<FeedDataType>, { data }) => {
        console.log('just got', data, state)

        return [...data, ...state]
    }),
)

/**
 * If there's no new message before; initialize a new one.
 * TODO: update local storage with new states?
 */
export const messagesReducer = createReducer(
    initialState.messages, // initial state should be the messages from the whole app state
    on(initializeMessages, (state, { type, ...data }) => {
        console.log('herereeeee')
        return new Map(Object.entries(data))
    }),
    on(updateMessages, (state: AppMessages, { type, ...data }) => {
        // update logic: old data, then new data
        console.log('?? PRESSED ??', typeof data === 'object')
        
        if (typeof data === 'object') {
            const newData = new Map<string, AppMessageValue>(Object.entries(data))
            console.log('newData', newData)
            return new Map(
                [...state, ...newData]
            )
        }
        return state
    }),

    on(
        newMessage,
        (state: AppMessages, { room, recipient_id, initiator_name, initiator_id, recipient_name }) =>
        {
            // find if there's existing chat, find it.
            for (const [key, value] of state) {
                if (value.recipient_id == recipient_id) {
                    // we can't sort or order items in map, stays as they were inserted
                    const newState = new Map([...state])
                    newState.delete(key)
                    // so it goes to the beginning.
                    newState.set(key, value)
                    console.log('found existing chat')

                    // TODO: best way to make a copy???
                    return newState
                }
            }
            return new Map([
                ...state,
                [
                    room,
                    {
                        texts: [],
                        unread_messages: 0,
                        recipient_name,
                        initiator_name,
                        recipient_id,
                        initiator_id,
                    },
                ],
            ])
        }
    ),
    on(
        newChatMessage,
        (state: AppMessages, chatMessage) => {   
            return new Map([
                ...state,
                [
                    chatMessage.room,
                    {
                        ...state.get(chatMessage.room),
                        texts: [...state.get(chatMessage.room)?.texts ?? [], chatMessage]
                    },
                ],
            ])
        },
    ),
)

// Logger Meta-Reducer (from claude.ai)
export function logger(reducer: ActionReducer<any>): ActionReducer<any> {
    return (state, action) => {
        console.log('-state', state);
        console.log('-action', action);

        return reducer(state, action);
    };
}

// Add this to your meta-reducers array (from claude.ai)
export const metaReducers: MetaReducer<any>[] = [logger];