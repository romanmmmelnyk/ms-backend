import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInstanceDto {
  @ApiProperty({ description: 'Instance name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Hosting provider ID' })
  @IsString()
  hostingId: string;

  @ApiProperty({ description: 'IP address of the instance' })
  @IsString()
  ipAddress: string;

  @ApiPropertyOptional({ 
    description: 'Port bindings configuration',
    example: { "portId": { "protocol": "tcp", "hostPort": 8080 } }
  })
  @IsOptional()
  @IsObject()
  portBindings?: object;
}
