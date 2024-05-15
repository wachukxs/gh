import { Action, createReducer, on } from '@ngrx/store'
import { newFeedData, newMessage, profileUpdateSuccess, setCorpMemberProfileData } from '../actions/corp-member.actions'
import { AppState, CorpMemberState, FeedDataType, initialCorpMemberState, initialState } from '../app.state'

export const corpMemberReducer = createReducer(
    initialCorpMemberState, // or initialState.corper // initial state should be the corper from the whole app state
    on(setCorpMemberProfileData, (state: CorpMemberState, { data }) => ({ ...data  })),

    /**
     * Update part of the corper state
     */
    on(profileUpdateSuccess, (state: CorpMemberState, { data }) => ({ ...state, ...data })),
)

export const feedReducer = createReducer(
    initialState.feed, // initial state should be the feed from the whole app state
    on(newFeedData, (state: Array<FeedDataType>, { data }) => {
        console.log('just got', data, state);
        
        return [...data, ...state]
    }),
)

export const messagesReducer = createReducer(
    initialState.messages, // initial state should be the messages from the whole app state
    on(newMessage, (state: any, { data }) => [data, ... state]),

)
