import { Module } from '@nestjs/common';
import { ReadyListener } from './ready.listener';

@Module({
  providers: [ReadyListener],
})
export class BotListenersModule {}
