import { Module } from '@nestjs/common';

import { MembersModule } from '../../members/members.module';
import { EventSignupModule } from '../features/event-signup/event-signup.module';
import { CoreCommands } from './core.commands';
import { GuildCommands } from './guild/guild.commands';

@Module({
  imports: [MembersModule, EventSignupModule],
  providers: [GuildCommands, CoreCommands],
})
export class BotCommandsModule {}
