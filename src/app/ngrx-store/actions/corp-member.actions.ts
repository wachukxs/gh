import { createAction, props } from '@ngrx/store';
import { AppMessageValue, AppMessages, ChatMessage, CorpMemberState } from '../app.state';

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
 * Set the whole AppMessages state
 */
export const initializeMessages = createAction(
  '[Chat] Initialize New Message',
  props<any | AppMessages>(), // we can omit texts & unread_messages, since it's a new message - it's gonna be empty.
);

/**
 * Update part (or probably whole) of the AppMessages state
 */
export const updateMessages = createAction(
  '[Chat] Update App Messages',
  props<object | AppMessages>(),
);

/**
 * Starting a new chat that didn't exist before
 * Only pass the state code of who you want to start the message with.
 */
export const newMessage = createAction(
  '[Chat] Start New Message',
  props<Omit<AppMessageValue, 'texts' | 'unread_messages'>>(), // we can omit texts & unread_messages, since it's a new message - it's gonna be empty.
);

/**
 * New message in an existing chat.
 */
export const newChatMessage = createAction(
  '[Chat] New Chat Message',
  props<ChatMessage>()
);
