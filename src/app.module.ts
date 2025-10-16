import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NecordModule } from 'necord';
import { IntentsBitField, Partials } from 'discord.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { existsSync } from 'fs';
import { join } from 'path';
import { BotModule } from './bot/bot.module';
import { MembersModule } from './members/members.module';
import { EventsModule } from './events/events.module';
import { SchedulerModule } from './scheduler/scheduler.module';

const env = process.env.NODE_ENV ?? 'development';
const envBasePath = join(process.cwd(), 'src', 'config', 'envs');
const envCandidates = [
  join(envBasePath, `.${env}.env`),
  join(envBasePath, '.env'),
  join(process.cwd(), '.env'),
].filter((filePath) => existsSync(filePath));
const envFilePath = envCandidates.length > 0 ? envCandidates : undefined;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
    }),
    NecordModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const token = configService.get<string>('DISCORD_TOKEN');
        if (!token) {
          throw new Error(
            'Missing DISCORD_TOKEN. Revisa los archivos .env cargados.',
          );
        }

        const development = configService.get<string>(
          'DISCORD_DEVELOPMENT_GUILD_ID',
        );

        return {
          token,
          intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildMessages,
            IntentsBitField.Flags.MessageContent,
          ],
          partials: [
            Partials.Channel,
            Partials.Message,
            Partials.GuildMember,
            Partials.ThreadMember,
          ],
          development: development ? [development] : undefined,
        };
      },
    }),
    SchedulerModule,
    MembersModule,
    EventsModule,
    BotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
