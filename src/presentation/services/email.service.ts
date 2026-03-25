import nodemailer, { Transporter } from 'nodemailer';

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachements?: Attachement[];
}

export interface Attachement {
  filename: string;
  path: string;
}

export interface EmailOptions {
  mailerService: string;
  mailerEmail: string;
  mailerSecretKey: string;
}

export class EmailService {
  private transporter: Transporter;

  constructor(
    emailOptions: EmailOptions,
    private readonly postToProvider: boolean
  ) {
    const { mailerService, mailerEmail, mailerSecretKey } = emailOptions;

    this.transporter = nodemailer.createTransport({
      service: mailerService,
      auth: {
        user: mailerEmail,
        pass: mailerSecretKey,
      },
    });
  }

  async sendEmail(options: SendMailOptions): Promise<boolean> {
    const { to, subject, htmlBody, attachements = [] } = options;

    try {
      if (!this.postToProvider) return true;

      await this.transporter.sendMail({
        to: to,
        subject: subject,
        html: htmlBody,
        attachments: attachements,
      });

      return true;
    } catch (error) {
      return false;
    }
  }
}
