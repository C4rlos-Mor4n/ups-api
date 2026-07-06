import { ApiProperty } from '@nestjs/swagger';
import { RouteStatus } from '@prisma/client';

export class RouteResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'Norte - Salesiana' })
  name!: string;

  @ApiProperty({ example: 'Ruta que cubre el norte de la ciudad', nullable: true })
  description!: string | null;

  @ApiProperty({ example: 'Norte' })
  direction!: string;

  @ApiProperty({ enum: RouteStatus, example: RouteStatus.ACTIVE })
  status!: RouteStatus;

  @ApiProperty({ example: true })
  isActive!: boolean;

  @ApiProperty({ type: 'string', format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: 'string', format: 'date-time' })
  updatedAt!: Date;
}
