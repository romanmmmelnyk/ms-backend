import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PortResponseDto {
  @ApiProperty({ description: 'Port ID' })
  id: string;

  @ApiProperty({ description: 'Port number (1-65535)' })
  number: number;

  @ApiProperty({ description: 'Port category ID' })
  categoryId: string;

  @ApiPropertyOptional({ description: 'Port description' })
  description?: string;

  @ApiProperty({ description: 'Port category information' })
  category: {
    id: string;
    name: string;
    description?: string;
  };

  @ApiProperty({ description: 'Instances using this port' })
  instances: Array<{
    id: string;
    name: string;
    ipAddress: string;
  }>;
}
