import { ApiProperty } from '@nestjs/swagger';

export class NoticeCreatorResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'admin@ups.edu.ec' })
  email!: string;

  @ApiProperty({ example: 'Admin User', nullable: true })
  name!: string | null;
}
