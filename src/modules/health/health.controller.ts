import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Basic health check' })
  @ApiOkResponse({ description: 'Service is healthy' })
  check(): Record<string, string> {
    return this.healthService.check();
  }

  @Public()
  @Get('db')
  @ApiOperation({ summary: 'Database connectivity health check' })
  @ApiOkResponse({ description: 'Database connection is healthy' })
  async checkDb(): Promise<Record<string, string>> {
    return this.healthService.checkDb();
  }
}
