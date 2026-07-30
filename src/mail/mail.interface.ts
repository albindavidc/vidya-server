export const I_MAIL_SERVICE = Symbol('IMailService');

export interface IMailService {
  sendOtpEmail(email: string, otp: string): Promise<void>;
}
