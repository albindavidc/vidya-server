import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BrevoClient } from '@getbrevo/brevo';
import { IMailService } from './mail.interface';

@Injectable()
export class MailService implements IMailService {
  private readonly _brevo: BrevoClient;

  constructor(private readonly _config: ConfigService) {
    this._brevo = new BrevoClient({
      apiKey: this._config.get<string>('BREVO_API_KEY') || '',
    });
  }

  async sendOtpEmail(to: string, otp: string): Promise<void> {
    console.log(` DEVELOPMENT MODE: OTP for ${to} is ${otp}`);

    const senderEmail =
      this._config.get<string>('BREVO_SENDER_EMAIL') ||
      '898d12001@smtp-brevo.com';
    const senderName = this._config.get<string>('BREVO_SENDER_NAME') || 'Vidya';

    try {
      await this._brevo.transactionalEmails.sendTransacEmail({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: to }],
        subject: 'Welcome to Vidya App! Verify your Email',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Welcome to Vidya App!</h2>
            <p>Thank you for signing up. To complete your registration, please use the verification code below:</p>
            <div style="padding: 15px; margin: 20px 0; background-color: #f4f4f4; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center;">
              ${otp}
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('⚠️ Failed to send OTP email via Brevo:', error);
      throw new Error('Email sending failed');
    }
  }
}
