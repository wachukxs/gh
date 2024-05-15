import { createFeatureSelector, createSelector } from '@ngrx/store'
import { AppState, CorpMemberState } from '../app.state'

export const corpMemberFeatureKey = 'corper'
export const feedFeatureKey = 'feed'
export const messagesFeatureKey = 'messages'

// explanation here https://stackoverflow.com/a/76989238/9259701

export const selectStateCorpMember = (state: AppState) => state.corper;

export const selectFeatureCorpMember =
    createFeatureSelector<CorpMemberState>('corper')

export const selectFeatureCorpMemberPpaId = createSelector(
    selectFeatureCorpMember,
    (state: CorpMemberState) => state.ppa_id,
)

export const selectFeatureFeed =
    createFeatureSelector<any>('feed')

export const selectFeatureMessages =
    createFeatureSelector<any>('messages')
