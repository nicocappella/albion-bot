import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotCommandsModule } from './commands/bot-commands.module';
import { BotListenersModule } from './listeners/bot-listeners.module';
import { EventSignupModule } from './features/event-signup/event-signup.module';

@Module({
  imports: [BotCommandsModule, BotListenersModule, EventSignupModule],
  providers: [BotService],
})
export class BotModule {}
