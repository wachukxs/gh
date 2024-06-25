import { createAction, props } from '@ngrx/store';
import { ChatMessage, CorpMemberState } from '../app.state';

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


export const newFeedData = createAction(
  '[Feed] New Feed Post',
  props<{ data: any[] }>()
);

/**
 * Only pass the state code of who you want to start the message with.
 */
export const newMessage = createAction(
  '[Chat] Start New Message',
  props<{ state_code: string, recipient_name?: string }>()
);

/**
 * Only pass the state code of who you want to start the message with.
 */
export const newChatMessage = createAction(
  '[Chat] New Chat Message',
  props<ChatMessage>()
);
