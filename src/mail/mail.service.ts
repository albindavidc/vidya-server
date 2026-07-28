import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendOtpEmail(to: string, otp: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Welcome to Vidya App! Verify your Email',
        text: `Your verification OTP is: ${otp}. This code will expire in 10 minutes.`,
        html: `
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
      console.error('Error sending OTP email', error);
      throw new InternalServerErrorException(
        'Could not send verification email.',
      );
    }
  }
}
