import { VerifyOtpDto } from '../dto/verify-otp.schema';

export class VerifyOtpCommand {
  constructor(public readonly dto: VerifyOtpDto) {}
}
