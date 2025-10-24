import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreatePortDto {
  @ApiProperty({ 
    description: 'Port number (1-65535)',
    minimum: 1,
    maximum: 65535,
    example: 8080
  })
  @IsInt()
  @Min(1)
  @Max(65535)
  @Transform(({ value }) => parseInt(value))
  number: number;

  @ApiProperty({ description: 'Port category ID' })
  @IsString()
  categoryId: string;

  @ApiPropertyOptional({ description: 'Port description' })
  @IsOptional()
  @IsString()
  description?: string;
}
