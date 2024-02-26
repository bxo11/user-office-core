import fs from 'fs';
import path from 'path';
import util from 'util';

import { logger } from '@user-office-software/duo-logger';
import EmailTemplates from 'email-templates';
import * as nodemailer from 'nodemailer';

import { isProduction } from '../../utils/helperFunctions';
import EmailSettings from './EmailSettings';
import { MailService, STFCEmailTemplate, SendMailResults } from './MailService';
import { ResultsPromise } from './SparkPost';

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

export class SMTPMailService extends MailService {
  private _email: EmailTemplates<any>;

  constructor() {
    super();

    const attachments = [];

    if (process.env.EMAIL_FOOTER_IMAGE_PATH !== undefined) {
      attachments.push({
        filename: 'logo.png',
        path: process.env.EMAIL_FOOTER_IMAGE_PATH,
        cid: 'logo1',
      });
    }

    this._email = new EmailTemplates({
      message: {
        from: process.env.EMAIL_SENDER,
        attachments,
      },
      send: true,
      transport: nodemailer.createTransport({
        host: process.env.EMAIL_AUTH_HOST,
        port: parseInt(process.env.EMAIL_AUTH_PORT || '25'),
        ...this.getSmtpAuthOptions(),
      }),
      juice: true,
      juiceResources: {
        webResources: {
          relativeTo: path.resolve(process.env.EMAIL_TEMPLATE_PATH || ''),
        },
      },
    });
  }

  private getSmtpAuthOptions() {
    if (process.env.EMAIL_AUTH_USERNAME && process.env.EMAIL_AUTH_PASSWORD) {
      return {
        auth: {
          user: process.env.EMAIL_AUTH_USERNAME,
          pass: process.env.EMAIL_AUTH_PASSWORD,
        },
      };
    }

    return {
      secure: false,
      tls: {
        rejectUnauthorized: false,
      },
    };
  }

  async sendMail(options: EmailSettings): ResultsPromise<SendMailResults> {
    const emailPromises: Promise<SendMailResults>[] = [];

    const sendMailResults: SendMailResults = {
      total_rejected_recipients: 0,
      total_accepted_recipients: 0,
      id: Math.random().toString(36).substring(7),
    };

    if (process.env.NODE_ENV === 'test') {
      sendMailResults.id = 'test';
    }

    if (process.env.NODE_ENV === 'test') {
      return { results: sendMailResults };
    }

    options.recipients.forEach((participant) => {
      emailPromises.push(
        this._email.send({
          template: options.content.template_id,
          message: {
            ...(typeof participant.address !== 'string'
              ? {
                  to: {
                    address: isProduction
                      ? participant.address?.email
                      : <string>process.env.SINK_EMAIL,
                    name: participant.address?.header_to,
                  },
                }
              : {
                  to: isProduction
                    ? participant.address
                    : <string>process.env.SINK_EMAIL,
                }),
          },
          locals: options.substitution_data,
        })
      );
    });

    return Promise.allSettled(emailPromises).then((results) => {
      results.forEach((result) => {
        if (result.status === 'rejected') {
          logger.logError('Unable to send email to user', {
            error: result.reason,
          });
          sendMailResults.total_rejected_recipients++;
        } else {
          sendMailResults.total_accepted_recipients++;
        }
      });

      return sendMailResults.total_rejected_recipients > 0
        ? Promise.reject({ results: sendMailResults })
        : Promise.resolve({ results: sendMailResults });
    });
  }

  // TODO: This might need some attention from STFC and return the templates used in their email sending service.
  async getEmailTemplates(
    includeDraft = false
  ): ResultsPromise<STFCEmailTemplate[]> {
    const templatesDir = process.env.EMAIL_TEMPLATE_PATH || '';
    try {
      const items = await readdir(templatesDir);
      const templates: STFCEmailTemplate[] = [];

      for (const item of items) {
        const itemPath = path.join(templatesDir, item);
        const itemStat = await stat(itemPath);

        if (itemStat.isDirectory()) {
          let isDraft = false;

          // Optionally, check if this template is a draft by some logic, e.g., a specific file exists
          // Example: A `.draft` file in the directory indicates it's a draft
          if (!includeDraft) {
            const draftFilePath = path.join(itemPath, '.draft');
            try {
              await stat(draftFilePath);
              isDraft = true;
            } catch {
              // No action needed if the file does not exist
            }
          }

          if (!includeDraft && isDraft) {
            continue;
          }

          templates.push({
            id: item,
            name: item,
            description: '',
          });
        }
      }

      return { results: templates };
    } catch (error) {
      logger.logError('Failed to list email templates', { error });

      return Promise.reject({
        error: 'Failed to list email templates',
        details: error,
      });
    }
  }
}
