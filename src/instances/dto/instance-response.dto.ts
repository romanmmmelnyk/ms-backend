import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InstanceResponseDto {
  @ApiProperty({ description: 'Instance ID' })
  id: string;

  @ApiProperty({ description: 'Instance name' })
  name: string;

  @ApiProperty({ description: 'Hosting provider ID' })
  hostingId: string;

  @ApiProperty({ description: 'IP address' })
  ipAddress: string;

  @ApiPropertyOptional({ description: 'Port bindings configuration' })
  portBindings?: object;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}
