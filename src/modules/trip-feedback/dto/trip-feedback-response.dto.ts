import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TripFeedbackResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  userId!: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002' })
  routeId!: string;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440003', nullable: true })
  driverId!: string | null;

  @ApiProperty({ example: 4 })
  rating!: number;

  @ApiPropertyOptional({ example: 'El servicio fue puntual', nullable: true })
  comment!: string | null;

  @ApiPropertyOptional({ example: '2026-07-01T08:00:00.000Z', nullable: true })
  travelDate!: string | null;

  @ApiProperty({ example: '2026-07-01T10:00:00.000Z' })
  createdAt!: string;
}
