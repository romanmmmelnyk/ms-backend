import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePortCategoryDto {
  @ApiProperty({ description: 'Port category name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Port category description' })
  @IsOptional()
  @IsString()
  description?: string;
}
