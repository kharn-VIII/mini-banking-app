import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'User ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'User first name', example: 'John', nullable: true })
  firstName: string | null;

  @ApiProperty({ description: 'User last name', example: 'Doe', nullable: true })
  lastName: string | null;

  @ApiProperty({ description: 'User creation date', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'User last update date', example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

