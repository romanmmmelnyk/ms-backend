import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HostingResponseDto {
  @ApiProperty({ description: 'Hosting ID' })
  id: string;

  @ApiProperty({ description: 'Hosting provider name' })
  providerName: string;

  @ApiProperty({ description: 'Provider account identifier' })
  providerAccount: string;

  @ApiPropertyOptional({ description: 'Annual hosting cost' })
  priceYear?: number;

  @ApiPropertyOptional({ description: 'Date when hosting was last paid' })
  paidAt?: Date;

  @ApiPropertyOptional({ description: 'Currency code' })
  currency?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiProperty({ description: 'Instances using this hosting' })
  instances: Array<{
    id: string;
    name: string;
    ipAddress: string;
  }>;

  @ApiProperty({ description: 'Number of instances using this hosting' })
  instanceCount: number;
}
