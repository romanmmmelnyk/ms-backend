import { IsString, IsEnum, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum Protocol {
  TCP = 'tcp',
  UDP = 'udp',
}

export class BindPortDto {
  @ApiProperty({ description: 'Port ID to bind' })
  @IsString()
  portId: string;

  @ApiProperty({ 
    description: 'Protocol for the port binding',
    enum: Protocol,
    default: Protocol.TCP
  })
  @IsEnum(Protocol)
  protocol: Protocol;

  @ApiPropertyOptional({ 
    description: 'Host port number (1-65535)',
    minimum: 1,
    maximum: 65535
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(65535)
  hostPort?: number;
}

export class PortBindingResponseDto {
  @ApiProperty({ description: 'Port ID' })
  portId: string;

  @ApiProperty({ description: 'Protocol' })
  protocol: string;

  @ApiPropertyOptional({ description: 'Host port number' })
  hostPort?: number;

  @ApiProperty({ description: 'Binding configuration' })
  binding: object;

  @ApiProperty({ description: 'Binding timestamp' })
  boundAt: Date;
}
