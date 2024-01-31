// NOTE: When creating new event we need to follow the same name standardization/convention: [WHERE]_[WHAT]
export enum Event {
  PROPOSAL_CREATED = 'PROPOSAL_CREATED',
  PROPOSAL_UPDATED = 'PROPOSAL_UPDATED',
  PROPOSAL_SUBMITTED = 'PROPOSAL_SUBMITTED',
  PROPOSAL_DELETED = 'PROPOSAL_DELETED',
  PROPOSAL_FEASIBLE = 'PROPOSAL_FEASIBLE',
  PROPOSAL_UNFEASIBLE = 'PROPOSAL_UNFEASIBLE',
  PROPOSAL_FAP_SELECTED = 'PROPOSAL_FAP_SELECTED',
  PROPOSAL_INSTRUMENT_SELECTED = 'PROPOSAL_INSTRUMENT_SELECTED',
  PROPOSAL_FEASIBILITY_REVIEW_UPDATED = 'PROPOSAL_FEASIBILITY_REVIEW_UPDATED',
  PROPOSAL_FEASIBILITY_REVIEW_SUBMITTED = 'PROPOSAL_FEASIBILITY_REVIEW_SUBMITTED',
  PROPOSAL_SAMPLE_REVIEW_SUBMITTED = 'PROPOSAL_SAMPLE_REVIEW_SUBMITTED',
  PROPOSAL_SAMPLE_SAFE = 'PROPOSAL_SAMPLE_SAFE',
  PROPOSAL_ALL_FAP_REVIEWERS_SELECTED = 'PROPOSAL_ALL_FAP_REVIEWERS_SELECTED',
  PROPOSAL_FAP_REVIEW_UPDATED = 'PROPOSAL_FAP_REVIEW_UPDATED',
  PROPOSAL_FAP_REVIEW_SUBMITTED = 'PROPOSAL_FAP_REVIEW_SUBMITTED',
  PROPOSAL_ALL_FAP_REVIEWS_SUBMITTED = 'PROPOSAL_ALL_FAP_REVIEWS_SUBMITTED',
  PROPOSAL_FAP_MEETING_SAVED = 'PROPOSAL_FAP_MEETING_SAVED',
  PROPOSAL_FAP_MEETING_SUBMITTED = 'PROPOSAL_FAP_MEETING_SUBMITTED',
  PROPOSAL_FAP_MEETING_RANKING_OVERWRITTEN = 'PROPOSAL_FAP_MEETING_RANKING_OVERWRITTEN',
  PROPOSAL_FAP_MEETING_REORDER = 'PROPOSAL_FAP_MEETING_REORDER',
  PROPOSAL_MANAGEMENT_DECISION_UPDATED = 'PROPOSAL_MANAGEMENT_DECISION_UPDATED',
  PROPOSAL_MANAGEMENT_DECISION_SUBMITTED = 'PROPOSAL_MANAGEMENT_DECISION_SUBMITTED',
  PROPOSAL_INSTRUMENT_SUBMITTED = 'PROPOSAL_INSTRUMENT_SUBMITTED',
  PROPOSAL_ACCEPTED = 'PROPOSAL_ACCEPTED',
  PROPOSAL_RESERVED = 'PROPOSAL_RESERVED',
  PROPOSAL_REJECTED = 'PROPOSAL_REJECTED',
  CALL_CREATED = 'CALL_CREATED',
  CALL_ENDED = 'CALL_ENDED',
  CALL_ENDED_INTERNAL = 'CALL_ENDED_INTERNAL',
  CALL_REVIEW_ENDED = 'CALL_REVIEW_ENDED',
  CALL_FAP_REVIEW_ENDED = 'CALL_FAP_REVIEW_ENDED',
  USER_UPDATED = 'USER_UPDATED',
  USER_ROLE_UPDATED = 'USER_ROLE_UPDATED',
  USER_DELETED = 'USER_DELETED',
  USER_PASSWORD_RESET_EMAIL = 'USER_PASSWORD_RESET_EMAIL',
  EMAIL_INVITE = 'EMAIL_INVITE',
  FAP_CREATED = 'FAP_CREATED',
  FAP_UPDATED = 'FAP_UPDATED',
  FAP_MEMBERS_ASSIGNED = 'FAP_MEMBERS_ASSIGNED',
  FAP_MEMBER_REMOVED = 'FAP_MEMBER_REMOVED',
  FAP_PROPOSAL_REMOVED = 'FAP_PROPOSAL_REMOVED',
  FAP_MEMBER_ASSIGNED_TO_PROPOSAL = 'FAP_MEMBER_ASSIGNED_TO_PROPOSAL',
  FAP_MEMBER_REMOVED_FROM_PROPOSAL = 'FAP_MEMBER_REMOVED_FROM_PROPOSAL',
  FAP_REVIEWER_NOTIFIED = 'FAP_REVIEWER_NOTIFIED',
  PROPOSAL_NOTIFIED = 'PROPOSAL_NOTIFIED',
  PROPOSAL_SAFETY_NOTIFIED = 'PROPOSAL_SAFETY_NOTIFIED',
  PROPOSAL_CLONED = 'PROPOSAL_CLONED',
  PROPOSAL_STATUS_ACTION_EXECUTED = 'PROPOSAL_STATUS_ACTION_EXECUTED',
  PROPOSAL_STATUS_CHANGED_BY_WORKFLOW = 'PROPOSAL_STATUS_CHANGED_BY_WORKFLOW',
  PROPOSAL_STATUS_CHANGED_BY_USER = 'PROPOSAL_STATUS_CHANGED_BY_USER',
  TOPIC_ANSWERED = 'TOPIC_ANSWERED',
  PROPOSAL_BOOKING_TIME_SLOT_ADDED = 'PROPOSAL_BOOKING_TIME_SLOT_ADDED',
  PROPOSAL_BOOKING_TIME_SLOTS_REMOVED = 'PROPOSAL_BOOKING_TIME_SLOTS_REMOVED',
  PROPOSAL_BOOKING_TIME_ACTIVATED = 'PROPOSAL_BOOKING_TIME_ACTIVATED',
  PROPOSAL_BOOKING_TIME_COMPLETED = 'PROPOSAL_BOOKING_TIME_COMPLETED',
  PROPOSAL_BOOKING_TIME_UPDATED = 'PROPOSAL_BOOKING_TIME_UPDATED',
  PROPOSAL_BOOKING_TIME_REOPENED = 'PROPOSAL_BOOKING_TIME_REOPENED',
  INSTRUMENT_CREATED = 'INSTRUMENT_CREATED',
  INSTRUMENT_UPDATED = 'INSTRUMENT_UPDATED',
  INSTRUMENT_DELETED = 'INSTRUMENT_DELETED',
  INSTRUMENT_ASSIGNED_TO_SCIENTIST = 'INSTRUMENT_ASSIGNED_TO_SCIENTIST',
  PREDEFINED_MESSAGE_CREATED = 'PREDEFINED_MESSAGE_CREATED',
  PREDEFINED_MESSAGE_UPDATED = 'PREDEFINED_MESSAGE_UPDATED',
  PREDEFINED_MESSAGE_DELETED = 'PREDEFINED_MESSAGE_DELETED',
  INTERNAL_REVIEW_CREATED = 'INTERNAL_REVIEW_CREATED',
  INTERNAL_REVIEW_UPDATED = 'INTERNAL_REVIEW_UPDATED',
  INTERNAL_REVIEW_DELETED = 'INTERNAL_REVIEW_DELETED',
}

export const EventLabel = new Map<Event, string>([
  [Event.PROPOSAL_CREATED, 'Event occurs when proposal is created'],
  [Event.PROPOSAL_UPDATED, 'Event occurs when proposal is updated'],
  [Event.PROPOSAL_SUBMITTED, 'Event occurs when proposal is submitted'],
  [Event.PROPOSAL_DELETED, 'Event occurs when proposal is removed'],
  [
    Event.PROPOSAL_FEASIBLE,
    'Event occurs when proposal feasibility review is submitted with value of feasible',
  ],
  [
    Event.PROPOSAL_UNFEASIBLE,
    'Event occurs when proposal feasibility review is submitted with value of unfeasible',
  ],
  [
    Event.PROPOSAL_FAP_SELECTED,
    'Event occurs when FAP gets assigned to a proposal',
  ],
  [
    Event.PROPOSAL_INSTRUMENT_SELECTED,
    'Event occurs when instrument gets assigned to a proposal',
  ],
  [
    Event.PROPOSAL_FEASIBILITY_REVIEW_UPDATED,
    'Event occurs when proposal feasibility review is updated',
  ],
  [
    Event.PROPOSAL_FEASIBILITY_REVIEW_SUBMITTED,
    'Event occurs when proposal feasibility review is submitted with any value',
  ],
  [
    Event.PROPOSAL_SAMPLE_REVIEW_SUBMITTED,
    'Event occurs when proposal sample review gets submitted with any value',
  ],
  [
    Event.PROPOSAL_SAMPLE_SAFE,
    'Event occurs when proposal sample review gets submitted with value of low risk',
  ],
  [
    Event.PROPOSAL_ALL_FAP_REVIEWERS_SELECTED,
    'Event occurs when all FAP reviewers are selected on a proposal',
  ],
  [
    Event.PROPOSAL_FAP_REVIEW_UPDATED,
    'Event occurs when at least one proposal FAP review is updated',
  ],
  [
    Event.PROPOSAL_FAP_REVIEW_SUBMITTED,
    'Event occurs when at least one proposal FAP review is submitted',
  ],
  [
    Event.PROPOSAL_ALL_FAP_REVIEWS_SUBMITTED,
    'Event occurs when all FAP reviews on a proposal are submitted',
  ],
  [
    Event.PROPOSAL_FAP_MEETING_SAVED,
    'Event occurs when FAP meeting is saved on a proposal',
  ],
  [
    Event.PROPOSAL_FAP_MEETING_SUBMITTED,
    'Event occurs when FAP meeting is submitted on a proposal',
  ],
  [
    Event.PROPOSAL_FAP_MEETING_RANKING_OVERWRITTEN,
    'Event occurs when FAP meeting ranking is overwritten on a proposal',
  ],
  [
    Event.PROPOSAL_FAP_MEETING_REORDER,
    'Event occurs when proposals are reordered in FAP meeting components',
  ],
  [
    Event.PROPOSAL_INSTRUMENT_SUBMITTED,
    'Event occurs when instrument is submitted after FAP meeting is finalized',
  ],
  [
    Event.PROPOSAL_ACCEPTED,
    'Event occurs when proposal gets final decision as accepted',
  ],
  [
    Event.PROPOSAL_MANAGEMENT_DECISION_UPDATED,
    'Event occurs when proposal management decision is updated',
  ],
  [
    Event.PROPOSAL_MANAGEMENT_DECISION_SUBMITTED,
    'Event occurs when proposal management decision is submitted',
  ],
  [Event.PROPOSAL_REJECTED, 'Event occurs when proposal gets rejected'],
  [Event.PROPOSAL_RESERVED, 'Event occurs when proposal gets reserved'],
  [
    Event.CALL_ENDED,
    'Event occurs on a specific call end date set on the call',
  ],
  [
    Event.CALL_ENDED_INTERNAL,
    'Event occurs on a specific call internal end date set on the call',
  ],
  [Event.CALL_CREATED, 'Event occurs on a when a call is created'],
  [
    Event.CALL_REVIEW_ENDED,
    'Event occurs on a specific call review end date set on the call',
  ],
  [
    Event.CALL_FAP_REVIEW_ENDED,
    'Event occurs on a specific call FAP review end date set on the call',
  ],
  [Event.USER_UPDATED, 'Event occurs when user is updated'],
  [Event.USER_ROLE_UPDATED, 'Event occurs when user roles are updated'],
  [Event.USER_DELETED, 'Event occurs when user is removed'],
  [
    Event.USER_PASSWORD_RESET_EMAIL,
    'Event occurs when user password is reset by email',
  ],
  [Event.EMAIL_INVITE, 'Event occurs when user is created using email invite'],
  [Event.FAP_CREATED, 'Event occurs when FAP is created'],
  [Event.FAP_UPDATED, 'Event occurs when FAP is updated'],
  [Event.FAP_MEMBERS_ASSIGNED, 'Event occurs when we assign member/s to a FAP'],
  [
    Event.FAP_REVIEWER_NOTIFIED,
    'Event occurs when we notify the FAP reviewer, about its not submitted review, by email 2 days before the review end date',
  ],
  [
    Event.FAP_MEMBER_REMOVED,
    'Event occurs when FAP member gets removed from the panel',
  ],
  [
    Event.FAP_PROPOSAL_REMOVED,
    'Event occurs when proposal is removed from a FAP',
  ],
  [
    Event.FAP_MEMBER_ASSIGNED_TO_PROPOSAL,
    'Event occurs when FAP member gets assigned to a proposal for a review',
  ],
  [
    Event.FAP_MEMBER_REMOVED_FROM_PROPOSAL,
    'Event occurs when FAP member is removed from proposal for review',
  ],
  [Event.PROPOSAL_NOTIFIED, 'Event occurs when proposal is notified'],
  [Event.PROPOSAL_SAFETY_NOTIFIED, 'Event occurs when Safety is notified'],
  [Event.PROPOSAL_CLONED, 'Event occurs when proposal is cloned'],
  [
    Event.PROPOSAL_STATUS_ACTION_EXECUTED,
    'Event occurs when the proposal status action is being executed in the status engine',
  ],
  [
    Event.PROPOSAL_STATUS_CHANGED_BY_WORKFLOW,
    'Event occurs when the proposal status was changed by the workflow engine',
  ],
  [
    Event.PROPOSAL_STATUS_CHANGED_BY_USER,
    'Event occurs when the proposal status was changed by the user',
  ],
  [
    Event.TOPIC_ANSWERED,
    'Event occurs when the user clicks save on a topic in any questionary',
  ],
  [
    Event.PROPOSAL_BOOKING_TIME_SLOT_ADDED,
    'Event occurs when the new time slot is booked in the scheduler',
  ],
  [
    Event.PROPOSAL_BOOKING_TIME_SLOTS_REMOVED,
    'Event occurs when the time slots are removed in the scheduler',
  ],
  [
    Event.PROPOSAL_BOOKING_TIME_ACTIVATED,
    'Event occurs when the time slot booking is activated in the scheduler',
  ],
  [
    Event.PROPOSAL_BOOKING_TIME_COMPLETED,
    'Event occurs when the time slot booking is completed in the scheduler',
  ],
  [
    Event.PROPOSAL_BOOKING_TIME_UPDATED,
    'Event occurs when the time slot booking is updated in the scheduler',
  ],
  [
    Event.PROPOSAL_BOOKING_TIME_REOPENED,
    'Event occurs when the time slot booking is re-opened in the scheduler',
  ],
  [Event.INSTRUMENT_DELETED, 'Event occurs when the instrument is removed'],
  [
    Event.PREDEFINED_MESSAGE_CREATED,
    'Event occurs when predefined message is created',
  ],
  [
    Event.PREDEFINED_MESSAGE_UPDATED,
    'Event occurs when predefined message is updated',
  ],
  [
    Event.PREDEFINED_MESSAGE_DELETED,
    'Event occurs when predefined message is removed',
  ],
  [
    Event.INTERNAL_REVIEW_CREATED,
    'Event occurs when internal (technical) review is created',
  ],
  [
    Event.INTERNAL_REVIEW_UPDATED,
    'Event occurs when internal (technical) review is updated',
  ],
  [
    Event.INTERNAL_REVIEW_DELETED,
    'Event occurs when internal (technical) review is removed',
  ],
]);
