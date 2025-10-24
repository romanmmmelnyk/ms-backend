import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PortCategoryResponseDto {
  @ApiProperty({ description: 'Port category ID' })
  id: string;

  @ApiProperty({ description: 'Port category name' })
  name: string;

  @ApiPropertyOptional({ description: 'Port category description' })
  description?: string;

  @ApiProperty({ description: 'Ports in this category' })
  ports: Array<{
    id: string;
    number: number;
    description?: string;
  }>;

  @ApiProperty({ description: 'Number of ports in this category' })
  portCount: number;
}
