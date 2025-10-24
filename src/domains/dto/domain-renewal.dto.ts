import { ApiProperty } from '@nestjs/swagger';

export class DomainRenewalResponseDto {
  @ApiProperty({ description: 'Domain ID' })
  domainId: string;

  @ApiProperty({ description: 'Domain name' })
  domainName: string;

  @ApiProperty({ description: 'New expiration date' })
  newExpirationDate: Date;

  @ApiProperty({ description: 'Renewal amount charged' })
  renewalAmount: number;

  @ApiProperty({ description: 'Currency' })
  currency: string;

  @ApiProperty({ description: 'Renewal timestamp' })
  renewedAt: Date;

  @ApiProperty({ description: 'Transaction ID from billing system' })
  transactionId: string;
}
