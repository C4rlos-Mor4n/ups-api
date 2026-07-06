import { ApiProperty } from '@nestjs/swagger';
import { DriverStatus } from '@prisma/client';

export class DriverResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'Juan Pérez' })
  name!: string;

  @ApiProperty({ example: '+593991234567', nullable: true })
  phone!: string | null;

  @ApiProperty({ example: 'L123456789', nullable: true })
  licenseNumber!: string | null;

  @ApiProperty({ enum: DriverStatus, example: DriverStatus.ACTIVE })
  status!: DriverStatus;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', nullable: true })
  assignedVehicleId!: string | null;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', nullable: true })
  assignedRouteId!: string | null;

  @ApiProperty({ type: 'string', format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: 'string', format: 'date-time' })
  updatedAt!: Date;
}
