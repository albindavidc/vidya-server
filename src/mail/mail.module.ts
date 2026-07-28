import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('SMTP_HOST'),
          port: config.get<number>('SMTP_PORT'),
          secure: true, // true for port 465, false for other ports
          auth: {
            user: config.get<string>('SMTP_USER'),
            pass: config.get<string>('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: config.get<string>('SMTP_FROM'),
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
