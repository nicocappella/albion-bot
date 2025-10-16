import { Module } from '@nestjs/common';
import { EventSignupService } from './event-signup.service';
import { EventSignupListener } from './event-signup.listener';

@Module({
  providers: [EventSignupService, EventSignupListener],
  exports: [EventSignupService],
})
export class EventSignupModule {}
