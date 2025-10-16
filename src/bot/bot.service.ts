import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client } from 'discord.js';

@Injectable()
export class BotService implements OnModuleInit {
  private readonly logger = new Logger(BotService.name);

  constructor(private readonly client: Client) {}

  onModuleInit(): void {
    this.logger.log(
      `BotService inicializado. Cliente listo? ${this.client.isReady()}`,
    );

    this.client.on('debug', (info) => this.logger.debug(info));
    this.client.on('error', (error) =>
      this.logger.error(`Discord client error: ${error.message}`, error.stack),
    );
    this.client.on('shardError', (error) =>
      this.logger.error(`Discord shard error: ${error.message}`, error.stack),
    );
    this.client.once('ready', () => {
      this.logger.log('Evento ready capturado desde BotService.');
    });
  }
}
