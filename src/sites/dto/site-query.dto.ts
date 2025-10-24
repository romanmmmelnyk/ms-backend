import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { SiteStatus } from './create-site.dto';

export class SiteQueryDto {
  @ApiPropertyOptional({ 
    description: 'Filter by site status',
    enum: SiteStatus
  })
  @IsOptional()
  @IsEnum(SiteStatus)
  status?: SiteStatus;

  @ApiPropertyOptional({ description: 'Filter by domain name' })
  @IsOptional()
  @IsString()
  domain?: string;

  @ApiPropertyOptional({ description: 'Filter by instance ID' })
  @IsOptional()
  @IsString()
  instance?: string;
}
