import { ApiProperty } from '@nestjs/swagger';
import { StopResponseDto } from '../../stops/dto/stop-response.dto';

export class MobileRouteStopResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 1 })
  stopOrder!: number;

  @ApiProperty({ example: 15, nullable: true })
  estimatedArrivalMinutes!: number | null;

  @ApiProperty({ example: 'Parada principal', nullable: true })
  notes!: string | null;

  @ApiProperty({ type: StopResponseDto })
  stop!: StopResponseDto;
}
