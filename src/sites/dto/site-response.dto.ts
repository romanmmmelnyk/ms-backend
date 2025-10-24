import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SiteStatus } from './create-site.dto';

export class SiteResponseDto {
  @ApiProperty({ description: 'Site ID' })
  id: string;

  @ApiProperty({ description: 'Site name' })
  name: string;

  @ApiProperty({ description: 'Site purpose' })
  purpose: string;

  @ApiProperty({ description: 'Instance ID' })
  instanceId: string;

  @ApiPropertyOptional({ description: 'Primary domain ID' })
  primaryDomainId?: string;

  @ApiPropertyOptional({ description: 'Analytics configuration' })
  analytics?: {
    provider: string;
    cfg: object;
    enabled: boolean;
  };

  @ApiProperty({ description: 'Site status', enum: SiteStatus })
  status: SiteStatus;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}
