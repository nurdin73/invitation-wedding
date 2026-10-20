import nodemailer, { type Transporter } from 'nodemailer';
import { env } from '../../configs/env';
import type { ISmtpPort, SendMailPayload } from '../smtp.port';

export class NodemailerSmtpAdapter implements ISmtpPort {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth:
        env.SMTP_USER && env.SMTP_PASS
          ? {
              user: env.SMTP_USER,
              pass: env.SMTP_PASS,
            }
          : undefined,
      tls: {
        rejectUnauthorized: env.NODE_ENV === 'production',
      },
    });
  }

  async sendMail(payload: SendMailPayload): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: env.SMTP_FROM_EMAIL,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      });
      return true;
    } catch (err) {
      console.error(`Gagal mengirim email ke [${payload.to}]:`, err);
      return false;
    }
  }
}
