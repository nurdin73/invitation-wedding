export interface SendMailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface ISmtpPort {
  sendMail(payload: SendMailPayload): Promise<boolean>;
}
