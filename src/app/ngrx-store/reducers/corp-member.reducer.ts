import { Action, createReducer, on } from '@ngrx/store'
import {
    newChatMessage,
    newFeedData,
    newMessage,
    profileUpdateSuccess,
    setCorpMemberProfileData,
} from '../actions/corp-member.actions'
import {
    AppState,
    CorpMemberState,
    FeedDataType,
    AppMessages,
    initialCorpMemberState,
    initialState,
    ChatMessage,
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
 */
export const messagesReducer = createReducer(
    initialState.messages, // initial state should be the messages from the whole app state
    on(
        newMessage,
        (state: AppMessages, { state_code, recipient_name }) =>
            new Map([
                ...state,
                [
                    state_code,
                    state.get(state_code) ?? {
                        texts: [],
                        recipient_name: recipient_name || state_code,
                        unread_messages: 0,
                    },
                ],
            ]),
    ),
    on(
        newChatMessage,
        (state: AppMessages, chatMessage) => {   
            return new Map([
                ...state,
                [
                    chatMessage.message_to,
                    {
                        ...state.get(chatMessage.message_to) ?? { unread_messages: 0, recipient_name: chatMessage.message_to },
                        texts: [...state.get(chatMessage.message_to)?.texts ?? [], chatMessage]
                    },
                ],
            ])
        },
    ),
)
