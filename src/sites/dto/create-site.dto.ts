import { IsString, IsOptional, IsObject, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum SiteStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export class CreateSiteDto {
  @ApiProperty({ description: 'Site name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Site purpose' })
  @IsString()
  purpose: string;

  @ApiProperty({ description: 'Instance ID where the site is hosted' })
  @IsString()
  instanceId: string;

  @ApiPropertyOptional({ description: 'Primary domain ID' })
  @IsOptional()
  @IsString()
  primaryDomainId?: string;

  @ApiPropertyOptional({ 
    description: 'Analytics configuration',
    example: { provider: 'google', cfg: {}, enabled: true }
  })
  @IsOptional()
  @IsObject()
  analytics?: {
    provider: string;
    cfg: object;
    enabled: boolean;
  };

  @ApiPropertyOptional({ 
    description: 'Site status',
    enum: SiteStatus,
    default: SiteStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(SiteStatus)
  status?: SiteStatus;
}
