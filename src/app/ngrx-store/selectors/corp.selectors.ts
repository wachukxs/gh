import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState, CorpMemberState } from '../app.state';

export const selectFeatureCorpMember = (state: AppState) => state.corper;
 
export const selectFeatureCorpMemberPpaId = createSelector(
    selectFeatureCorpMember,
  (state: CorpMemberState) => state.ppaId
);