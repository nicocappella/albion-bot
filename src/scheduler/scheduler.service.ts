import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  @Cron(CronExpression.EVERY_5_MINUTES)
  handleRosterSync(): void {
    this.logger.debug('Scheduler ready - plug roster sync here');
  }
}
