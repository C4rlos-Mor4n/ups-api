import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class TripFeedbackFiltersDto {
  @ApiPropertyOptional({ description: 'Filter by user ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ description: 'Filter by route ID', example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsUUID()
  @IsOptional()
  routeId?: string;
}
