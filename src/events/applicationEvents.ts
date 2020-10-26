import { Call } from '../models/Call';
import { Proposal } from '../models/Proposal';
import { SEP } from '../models/SEP';
import { TechnicalReview } from '../models/TechnicalReview';
import { User, UserRole } from '../models/User';
import { Event } from './event.enum';

interface GeneralEvent {
  type: Event;
  key: string;
  loggedInUserId: number | null;
  isRejection: boolean;
}

interface ProposalAcceptedEvent extends GeneralEvent {
  type: Event.PROPOSAL_ACCEPTED;
  proposal: Proposal;
}

interface ProposalSubmittedEvent extends GeneralEvent {
  type: Event.PROPOSAL_SUBMITTED;
  proposal: Proposal;
}

interface ProposalUpdatedEvent extends GeneralEvent {
  type: Event.PROPOSAL_UPDATED;
  proposal: Proposal;
}

interface ProposalRejectedEvent extends GeneralEvent {
  type: Event.PROPOSAL_REJECTED;
  proposal: Proposal;
  reason: string;
}

interface ProposalCreatedEvent extends GeneralEvent {
  type: Event.PROPOSAL_CREATED;
  proposal: Proposal;
}

interface ProposalNotifiedEvent extends GeneralEvent {
  type: Event.PROPOSAL_NOTIFIED;
  proposal: Proposal;
}

interface ProposalFeasibilityReviewSubmittedEvent extends GeneralEvent {
  type: Event.PROPOSAL_FEASIBILITY_REVIEW_SUBMITTED;
  technicalreview: TechnicalReview;
}

interface ProposalSampleReviewSubmittedEvent extends GeneralEvent {
  type: Event.PROPOSAL_SAMPLE_REVIEW_SUBMITTED;
  proposal: Proposal;
}

interface ProposalInstrumentSelectedEvent extends GeneralEvent {
  type: Event.PROPOSAL_INSTRUMENT_SELECTED;
  proposal: Proposal;
}

interface ProposalSEPSelectedEvent extends GeneralEvent {
  type: Event.PROPOSAL_SEP_SELECTED;
  proposal: Proposal;
}

interface ProposalInstrumentSubmittedEvent extends GeneralEvent {
  type: Event.PROPOSAL_INSTRUMENT_SUBMITTED;
  proposal: Proposal;
}

interface ProposalSEPMeetingSubmittedEvent extends GeneralEvent {
  type: Event.PROPOSAL_SEP_MEETING_SUBMITTED;
  proposal: Proposal;
}

interface UserResetPasswordEmailEvent extends GeneralEvent {
  type: Event.USER_PASSWORD_RESET_EMAIL;
  userlinkresponse: {
    user: User;
    link: string;
  };
}

interface UserUpdateEvent extends GeneralEvent {
  type: Event.USER_UPDATED;
  user: User;
}

interface UserRoleUpdateEvent extends GeneralEvent {
  type: Event.USER_ROLE_UPDATED;
  user: User;
}

interface UserCreateEvent extends GeneralEvent {
  type: Event.USER_CREATED;
  userlinkresponse: {
    user: User;
    link: string;
  };
}

interface UserDeletedEvent extends GeneralEvent {
  type: Event.USER_DELETED;
  user: User;
}

interface EmailInvite extends GeneralEvent {
  type: Event.EMAIL_INVITE;
  emailinviteresponse: {
    userId: number;
    inviterId: number;
    role: UserRole;
  };
}

interface SEPCreatedEvent extends GeneralEvent {
  type: Event.SEP_CREATED;
  sep: SEP;
}

interface SEPUpdatedEvent extends GeneralEvent {
  type: Event.SEP_UPDATED;
  sep: SEP;
}

interface SEPMembersAssignedEvent extends GeneralEvent {
  type: Event.SEP_MEMBERS_ASSIGNED;
  sep: SEP;
}

interface SEPProposalAssignedEvent extends GeneralEvent {
  type: Event.SEP_PROPOSAL_ASSIGNED;
  sep: SEP;
}

interface SEPMemberAssignedToProposalEvent extends GeneralEvent {
  type: Event.SEP_MEMBER_ASSIGNED_TO_PROPOSAL;
  sep: SEP;
}

interface SEPMemberRemovedFromProposalEvent extends GeneralEvent {
  type: Event.SEP_MEMBER_REMOVED_FROM_PROPOSAL;
  sep: SEP;
}

interface SEPProposalRemovedEvent extends GeneralEvent {
  type: Event.SEP_PROPOSAL_REMOVED;
  sep: SEP;
}

interface SEPMemberRemovedEvent extends GeneralEvent {
  type: Event.SEP_MEMBER_REMOVED;
  sep: SEP;
}

interface CallEndedEvent extends GeneralEvent {
  type: Event.CALL_ENDED;
  call: Call;
}

export type ApplicationEvent =
  | ProposalAcceptedEvent
  | ProposalUpdatedEvent
  | ProposalSubmittedEvent
  | ProposalRejectedEvent
  | ProposalCreatedEvent
  | UserCreateEvent
  | EmailInvite
  | UserResetPasswordEmailEvent
  | UserUpdateEvent
  | UserRoleUpdateEvent
  | SEPCreatedEvent
  | SEPUpdatedEvent
  | SEPMembersAssignedEvent
  | SEPProposalAssignedEvent
  | SEPProposalRemovedEvent
  | SEPMemberRemovedEvent
  | SEPMemberAssignedToProposalEvent
  | SEPMemberRemovedFromProposalEvent
  | UserDeletedEvent
  | ProposalNotifiedEvent
  | CallEndedEvent
  | ProposalFeasibilityReviewSubmittedEvent
  | ProposalSampleReviewSubmittedEvent
  | ProposalInstrumentSelectedEvent
  | ProposalSEPSelectedEvent
  | ProposalInstrumentSubmittedEvent
  | ProposalSEPMeetingSubmittedEvent;
