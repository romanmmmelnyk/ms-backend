import { IsString, IsOptional, IsDateString, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateHostingDto {
  @ApiProperty({ description: 'Hosting provider name (e.g., AWS, DigitalOcean, Linode)' })
  @IsString()
  providerName: string;

  @ApiProperty({ description: 'Provider account identifier' })
  @IsString()
  providerAccount: string;

  @ApiPropertyOptional({ 
    description: 'Annual hosting cost',
    minimum: 0,
    example: 120.00
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  priceYear?: number;

  @ApiPropertyOptional({ description: 'Date when hosting was last paid (ISO8601)' })
  @IsOptional()
  @IsDateString()
  paidAt?: string;

  @ApiPropertyOptional({ 
    description: 'Currency code',
    default: 'USD',
    example: 'USD'
  })
  @IsOptional()
  @IsString()
  currency?: string;
}
