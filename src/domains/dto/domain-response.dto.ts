import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class DomainQueryDto {
  @ApiPropertyOptional({ 
    description: 'Filter domains expiring within this many days',
    minimum: 1,
    example: 30
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  expiringInDays?: number;

  @ApiPropertyOptional({ description: 'Filter by domain provider' })
  @IsOptional()
  @IsString()
  provider?: string;
}

export class DomainResponseDto {
  @ApiProperty({ description: 'Domain ID' })
  id: string;

  @ApiProperty({ description: 'Domain name' })
  name: string;

  @ApiProperty({ description: 'Instance ID' })
  instanceId: string;

  @ApiProperty({ description: 'Domain provider' })
  provider: string;

  @ApiPropertyOptional({ description: 'Date until which the domain is paid' })
  paidUntil?: Date;

  @ApiPropertyOptional({ description: 'Annual price for the domain' })
  priceYear?: number;

  @ApiPropertyOptional({ description: 'Currency code' })
  currency?: string;

  @ApiProperty({ description: 'Auto-renewal enabled' })
  autoRenew: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;
}
