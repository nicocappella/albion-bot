import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Context, On, Once } from 'necord';
import type { ContextOf } from 'necord';

@Injectable()
export class ReadyListener {
  private readonly logger = new Logger(ReadyListener.name);

  constructor(private readonly configService: ConfigService) {}

  @Once('ready')
  public onReady(@Context() [client]: ContextOf<'ready'>) {
    const tag = client.user?.tag ?? 'desconocido';
    const guilds = client.guilds.cache.size;
    const devGuildId = this.configService.get<string>(
      'DISCORD_DEVELOPMENT_GUILD_ID',
    );

    this.logger.log(
      `Discord conectado como ${tag} | guilds cache: ${guilds} | devGuild: ${devGuildId}`,
    );

    if (devGuildId) {
      client.guilds
        .fetch(devGuildId)
        .then((guild) =>
          this.logger.log(`Dev guild confirmado: ${guild.name} (${guild.id})`),
        )
        .catch((error) =>
          this.logger.error(
            `No se pudo acceder al guild ${devGuildId}: ${error.message}`,
          ),
        );
    }
  }

  @On('warn')
  public onWarn(@Context() [message]: ContextOf<'warn'>) {
    this.logger.warn(message);
  }

  @On('error')
  public onError(@Context() [error]: ContextOf<'error'>) {
    this.logger.error(
      `Error desde discord.js: ${(error as Error).message}`,
      error as Error,
    );
  }
}
