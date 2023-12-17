import { createAction, props } from '@ngrx/store';
import { CorpMemberState } from '../app.state';

export const setCorpMemberProfileData = createAction(
  '[CorpMember] Set CorpMember Success',
  props<{ data: CorpMemberState }>()
);

// ??
export const updateCorpMemberProfile = createAction(
  '[CorpMember] Update Profile',
  props<{ data: CorpMemberState }>() // could also be part of the corpMemberState object
);

export const profileUpdateSuccess = createAction('[CorpMember] Profile Update Success', props<{data: any | CorpMemberState}>());
export const profileUpdateError = createAction('[CorpMember] Profile Update Error');
