import { logger } from '@user-office-software/duo-logger';
import { container } from 'tsyringe';

import { Tokens } from '../../config/Tokens';
import { AdminDataSource } from '../../datasources/AdminDataSource';
import { CallDataSource } from '../../datasources/CallDataSource';
import { FapDataSource } from '../../datasources/FapDataSource';
import { InstrumentDataSource } from '../../datasources/InstrumentDataSource';
import { ProposalDataSource } from '../../datasources/ProposalDataSource';
import { RedeemCodesDataSource } from '../../datasources/RedeemCodesDataSource';
import { ReviewMeetingDataSource } from '../../datasources/ReviewMeetingDataSource';
import { SafetyManagementDataSource } from '../../datasources/SafetyManagementDataSource';
import { UserDataSource } from '../../datasources/UserDataSource';
import { ApplicationEvent } from '../../events/applicationEvents';
import { Event } from '../../events/event.enum';
import { ProposalEndStatus } from '../../models/Proposal';
import { EsraStatus } from '../../models/SafetyManagement';
import { SettingsId } from '../../models/Settings';
import { UserRole } from '../../models/User';
import EmailSettings from '../MailService/EmailSettings';
import { MailService } from '../MailService/MailService';

export async function maxivEmailHandler(event: ApplicationEvent) {
  const mailService = container.resolve<MailService>(Tokens.MailService);
  const proposalDataSource = container.resolve<ProposalDataSource>(
    Tokens.ProposalDataSource
  );
  const fapDataSource = container.resolve<FapDataSource>(Tokens.FapDataSource);
  const userDataSource = container.resolve<UserDataSource>(
    Tokens.UserDataSource
  );
  const redeemCodesDataSource = container.resolve<RedeemCodesDataSource>(
    Tokens.RedeemCodesDataSource
  );
  const callDataSource = container.resolve<CallDataSource>(
    Tokens.CallDataSource
  );
  const safetyManagementDataSource =
    container.resolve<SafetyManagementDataSource>(
      Tokens.SafetyManagementDataSource
    );
  const adminDataSource = container.resolve<AdminDataSource>(
    Tokens.AdminDataSource
  );
  const reviewMeetingDataSource = container.resolve<ReviewMeetingDataSource>(
    Tokens.ReviewMeetingDataSource
  );
  const instrumentDataSource = container.resolve<InstrumentDataSource>(
    Tokens.InstrumentDataSource
  );

  if (event.isRejection) {
    return;
  }

  switch (event.type) {
    case Event.EMAIL_INVITE: {
      const user = await userDataSource.getUser(
        event.emailinviteresponse.userId
      );
      const inviter = await userDataSource.getBasicUserInfo(
        event.emailinviteresponse.inviterId
      );

      if (!user || !inviter) {
        logger.logError('Failed email invite', { user, inviter, event });

        return;
      }

      const redeemCode = await redeemCodesDataSource.getRedeemCodes({
        placeholderUserId: user.id,
      });

      if (!redeemCode[0]?.code) {
        logger.logError('Failed email invite. No redeem code found', {
          user,
          inviter,
          event,
        });

        return;
      }

      mailService
        .sendMail({
          content: {
            template_id:
              event.emailinviteresponse.role === UserRole.USER
                ? 'user-office-registration-invitation'
                : 'user-office-registration-invitation-reviewer',
          },
          substitution_data: {
            firstname: user.preferredname,
            lastname: user.lastname,
            email: user.email,
            inviterName: inviter.firstname,
            inviterLastname: inviter.lastname,
            inviterOrg: inviter.institution,
            redeemCode: redeemCode[0].code,
          },
          recipients: [{ address: user.email }],
        })
        .then((res) => {
          logger.logInfo('Successful email transmission', { res });
        })
        .catch((err: string) => {
          logger.logException('Failed email transmission', err);
        });

      return;
    }

    case Event.PROPOSAL_SUBMITTED: {
      const principalInvestigator = await userDataSource.getUser(
        event.proposal.proposerId
      );

      if (!principalInvestigator) {
        return;
      }

      const participants = await userDataSource.getProposalUsersFull(
        event.proposal.primaryKey
      );

      const call = await callDataSource.getCall(event.proposal.callId);

      const options: EmailSettings = {
        content: {
          template_id: 'proposal-submitted',
        },
        substitution_data: {
          piPreferredname: principalInvestigator.preferredname,
          piLastname: principalInvestigator.lastname,
          proposalNumber: event.proposal.proposalId,
          proposalTitle: event.proposal.title,
          coProposers: participants.map(
            (partipant) => `${partipant.preferredname} ${partipant.lastname} `
          ),
          callShortCode: call?.shortCode,
        },
        recipients: [
          { address: principalInvestigator.email },
          ...participants.map((partipant) => {
            return {
              address: {
                email: partipant.email,
                header_to: principalInvestigator.email,
              },
            };
          }),
        ],
      };

      mailService
        .sendMail(options)
        .then((res) => {
          logger.logInfo('Emails sent on proposal submission:', {
            result: res,
            event,
          });
        })
        .catch((err: string) => {
          logger.logError('Could not send email(s) on proposal submission:', {
            error: err,
            event,
          });
        });

      return;
    }

    case Event.PROPOSAL_NOTIFIED: {
      const principalInvestigator = await userDataSource.getUser(
        event.proposal.proposerId
      );
      const call = await callDataSource.getCall(event.proposal.callId);
      if (!principalInvestigator) {
        return;
      }
      const { finalStatus } = event.proposal;
      let templateId = '';
      if (finalStatus === ProposalEndStatus.ACCEPTED) {
        templateId = 'Accepted-Proposal';
      } else if (finalStatus === ProposalEndStatus.REJECTED) {
        templateId = 'Rejected-Proposal';
      } else if (finalStatus === ProposalEndStatus.RESERVED) {
        templateId = 'Reserved-Proposal';
      } else {
        logger.logError('Failed email notification', { event });

        return;
      }

      mailService
        .sendMail({
          content: {
            template_id: templateId,
          },
          substitution_data: {
            piPreferredname: principalInvestigator.preferredname,
            piLastname: principalInvestigator.lastname,
            proposalNumber: event.proposal.proposalId,
            proposalTitle: event.proposal.title,
            commentForUser: event.proposal.commentForUser,
            callShortCode: call?.shortCode,
          },
          recipients: [
            { address: principalInvestigator.email },
            {
              address: {
                email: 'maxivoffice',
                header_to: principalInvestigator.email,
              },
            },
          ],
        })
        .then((res) => {
          logger.logInfo('Email sent on proposal notify:', {
            result: res,
            event,
          });
        })
        .catch((err: string) => {
          logger.logError('Could not send email on proposal notify:', {
            error: err,
            event,
          });
        });

      return;
    }
    case Event.FAP_REVIEWER_NOTIFIED: {
      const { id: reviewId, userID, proposalPk } = event.fapReview;
      const fapReviewer = await userDataSource.getUser(userID);
      const proposal = await proposalDataSource.get(proposalPk);

      if (!fapReviewer || !proposal) {
        return;
      }

      const call = await callDataSource.getCall(proposal?.callId);

      mailService
        .sendMail({
          content: {
            template_id: 'review-reminder',
          },
          substitution_data: {
            fapReviewerPreferredName: fapReviewer.preferredname,
            fapReviewerLastName: fapReviewer.lastname,
            proposalNumber: proposal.proposalId,
            proposalTitle: proposal.title,
            commentForUser: proposal.commentForUser,
            callShortCode: call?.shortCode,
          },
          recipients: [
            { address: fapReviewer.email },
            {
              address: {
                email: 'maxivoffice',
                header_to: fapReviewer.email,
              },
            },
          ],
        })
        .then(async (res) => {
          await fapDataSource.setFapReviewNotificationEmailSent(
            reviewId,
            userID,
            proposalPk
          );
          logger.logInfo('Email sent on Fap reviewer notify:', {
            result: res,
            event,
          });
        })
        .catch((err: string) => {
          logger.logError('Could not send email on Fap reviewer notify:', {
            error: err,
            event,
          });
        });

      return;
    }
    case Event.INTERNAL_REVIEW_CREATED: {
      const internalReview = event.internalreview;
      const recipient = await userDataSource.getBasicUserInfo(
        internalReview.reviewerId
      );
      const setting = await adminDataSource.getSetting(
        SettingsId.INTERNAL_REVIEW_NOTIFICATION_EMAIL_TEMPLATE_ID
      );
      const templateId = setting?.settingsValue;

      if (!recipient || !templateId) {
        logger.logError(
          'Failed email notification on INTERNAL_REVIEW_CREATED',
          { templateId, recipient, event }
        );

        return;
      }

      mailService
        .sendMail({
          content: {
            template_id: templateId,
          },
          substitution_data: {
            // TODO add substitution data
          },
          recipients: [{ address: recipient?.email }],
        })
        .then((res) => {
          logger.logInfo('Email sent on INTERNAL_REVIEW_CREATED notify:', {
            result: res,
            event,
          });
        })
        .catch((err: string) => {
          logger.logError(
            'Could not send email on INTERNAL_REVIEW_CREATED notify:',
            {
              error: err,
              event,
            }
          );
        });

      return;
    }
    case Event.REVIEW_MEETING_NOTIFIED: {
      const reviewMeeting = event.reviewmeeting;
      const participants = await reviewMeetingDataSource.getParticipants(
        reviewMeeting.id
      );
      const templateId = JSON.parse(event.inputArgs ?? '{}')[0].templateId;
      const instrument = await instrumentDataSource.getInstrument(
        reviewMeeting.instrumentId
      );

      mailService
        .sendMail({
          content: {
            template_id: templateId,
          },
          substitution_data: {
            instrumentName: instrument?.name,
          },
          recipients: participants.map((participant) => {
            return { address: participant.email };
          }),
        })
        .then((res) => {
          logger.logInfo('Email sent on REVIEW_MEETING_NOTIFIED notify:', {
            result: res,
            event,
          });
        })
        .catch((err: string) => {
          logger.logError(
            'Could not send email on REVIEW_MEETING_NOTIFIED notify:',
            {
              error: err,
              event,
            }
          );
        });

      return;
    }
    case Event.PROPOSAL_SAFETY_MANAGEMENT_ESRA_STATUS_UPDATED: {
      const [{ statusComment }] = JSON.parse(event.inputArgs || '{}');

      const { proposalPk, esraStatus } = event.safetymanagement;

      const proposal = await proposalDataSource.get(proposalPk);
      const proposer = await userDataSource.getUser(proposal?.proposerId ?? 0);
      const participants = await userDataSource.getProposalUsers(proposalPk);

      if (!esraStatus || !proposer || !proposal) {
        return;
      }

      let templateId = '';
      switch (esraStatus) {
        case EsraStatus.ESRA_APPROVED.valueOf():
          templateId = 'esra-approved';
          break;
        case EsraStatus.ESRA_REJECTED.valueOf():
          templateId = 'esra-rejected';
          break;
        default:
          return;
      }

      mailService
        .sendMail({
          content: {
            template_id: templateId,
          },
          substitution_data: {
            proposalNumber: proposal.proposalId,
            proposalTitle: proposal.title,
            esraStatus: EsraStatus[esraStatus],
            esraComment: statusComment,
          },
          recipients: [
            { address: proposer.email },
            ...participants.map((partipant) => {
              return {
                address: partipant.email,
              };
            }),
          ],
        })
        .then(async (res) => {
          logger.logInfo('Email sent on esra status change', {
            result: res,
            event,
          });
        })
        .catch((err) => {
          logger.logError('Could not send email on esra status change', {
            error: err.toString(),
            event,
          });
        });

      return;
    }
    case Event.PROPOSAL_ESRA_REQUESTED: {
      const { id, proposalPk } = event.safetymanagement;
      const respomsibleSafetyManagers =
        await safetyManagementDataSource.getResponsibleUsers(id);
      const proposal = await proposalDataSource.get(proposalPk);
      const proposer = await userDataSource.getUser(proposal?.proposerId ?? 0);

      if (!proposal || !proposer) {
        return;
      }

      const [{ esraForm }] = JSON.parse(event.inputArgs || '{}');

      mailService
        .sendMail({
          content: {
            template_id: 'esra-requested',
          },
          substitution_data: {
            proposalNumber: proposal.proposalId,
            proposalTitle: proposal.title,
            ...esraForm,
          },
          recipients: [
            { address: proposer.email },
            ...respomsibleSafetyManagers.map((partipant) => {
              return {
                address: partipant.email,
              };
            }),
          ],
        })
        .then(async (res) => {
          logger.logInfo('Email sent on esra requested', {
            result: res,
            event,
          });
        })
        .catch((err) => {
          logger.logError('Could not send email on esra requested', {
            error: err.toString(),
            event,
          });
        });

      return;
    }
  }
}
