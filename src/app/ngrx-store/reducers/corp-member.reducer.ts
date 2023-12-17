import { Action, createReducer, on } from '@ngrx/store'
import { profileUpdateSuccess, setCorpMemberProfileData } from '../actions/corp-member.actions'
import { AppState, CorpMemberState, initialCorpMemberState, initialState } from '../app.state'

export const corpMemberReducer = createReducer(
    initialCorpMemberState, // or initialState.corper // initial state should be the corper from the whole app state
    on(setCorpMemberProfileData, (state: CorpMemberState, { data }) => ({ ...data  })),

    /**
     * Update part of the corper state
     */
    on(profileUpdateSuccess, (state: CorpMemberState, { data }) => ({ ...state, ...data })),
)
