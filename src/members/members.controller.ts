import { Controller, Get } from '@nestjs/common';

@Controller('members')
export class MembersController {
  @Get('health')
  healthCheck(): string {
    return 'members module ready';
  }
}
