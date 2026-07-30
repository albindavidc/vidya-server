import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { I_MAIL_SERVICE } from './mail.interface';

@Module({
  providers: [{ provide: I_MAIL_SERVICE, useClass: MailService }],
  exports: [I_MAIL_SERVICE],
})
export class MailModule {}
