import { IsString, IsOptional, IsDateString, IsNumber, IsBoolean, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateDomainDto {
  @ApiProperty({ description: 'Domain name (must be valid DNS format)' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Instance ID where the domain is hosted' })
  @IsString()
  instanceId: string;

  @ApiProperty({ description: 'Domain provider (e.g., Cloudflare, GoDaddy)' })
  @IsString()
  provider: string;

  @ApiPropertyOptional({ description: 'Date until which the domain is paid (ISO8601)' })
  @IsOptional()
  @IsDateString()
  paidUntil?: string;

  @ApiPropertyOptional({ 
    description: 'Annual price for the domain',
    minimum: 0,
    example: 12.99
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  priceYear?: number;

  @ApiPropertyOptional({ 
    description: 'Currency code',
    default: 'USD',
    example: 'USD'
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ 
    description: 'Auto-renewal enabled',
    default: false
  })
  @IsOptional()
  @IsBoolean()
  autoRenew?: boolean;
}
