import { Action, createReducer, on } from '@ngrx/store'
import { setCorpMember } from '../actions/corp-member.actions'
import { initialState } from '../app.state'

export const corpMemberFeatureKey = 'corper' // corpMember

export const corpMemberReducer = createReducer(
    initialState,
    on(setCorpMember, (state, { data }) => ({ corper: {...data} })),
)
