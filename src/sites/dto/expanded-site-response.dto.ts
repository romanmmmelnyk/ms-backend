import { ApiProperty } from '@nestjs/swagger';

export class ExpandedSiteResponseDto {
  @ApiProperty({ description: 'Site information' })
  site: {
    id: string;
    name: string;
    purpose: string;
    instanceId: string;
    primaryDomainId?: string;
    analytics?: {
      provider: string;
      cfg: object;
      enabled: boolean;
    };
    status: string;
    createdAt: Date;
    updatedAt: Date;
  };

  @ApiProperty({ description: 'Instance information' })
  instance: {
    id: string;
    name: string;
    hostingId: string;
    ipAddress: string;
    portBindings?: object;
    createdAt: Date;
    updatedAt: Date;
  };

  @ApiProperty({ description: 'Domains associated with the site' })
  domains: Array<{
    id: string;
    name: string;
    provider: string;
    paidUntil?: Date;
    priceYear?: number;
    currency?: string;
    autoRenew: boolean;
    createdAt: Date;
  }>;

  @ApiProperty({ description: 'Ports configured on the instance' })
  ports: Array<{
    id: string;
    number: number;
    categoryId: string;
    description?: string;
    category: {
      id: string;
      name: string;
      description?: string;
    };
  }>;

  @ApiProperty({ description: 'Hosting provider information' })
  hosting: {
    id: string;
    providerName: string;
    providerAccount: string;
    priceYear?: number;
    paidAt?: Date;
    currency?: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
