import { createAction, props } from '@ngrx/store';
import { CorpMemberState } from '../app.state';

export const setCorpMember = createAction(
  '[CorpMember] Set CorpMember Success',
  props<{ data: CorpMemberState }>()
);
