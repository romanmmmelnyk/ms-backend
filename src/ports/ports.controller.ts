import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PortsService } from './ports.service';
import { CreatePortDto } from './dto/create-port.dto';
import { UpdatePortDto } from './dto/update-port.dto';
import { PortResponseDto } from './dto/port-response.dto';

// TODO: Implement proper authentication guard
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
@ApiTags('ports')
@Controller('api/ports')
export class PortsController {
  constructor(private readonly portsService: PortsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new port' })
  @ApiResponse({ status: 201, description: 'Port created successfully', type: PortResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - invalid port number or category not found' })
  @SetMetadata('scopes', ['ports:write'])
  create(@Body() createPortDto: CreatePortDto) {
    return this.portsService.create(createPortDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all ports' })
  @ApiResponse({ status: 200, description: 'Ports retrieved successfully', type: [PortResponseDto] })
  @SetMetadata('scopes', ['ports:read'])
  findAll() {
    return this.portsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a port by ID' })
  @ApiParam({ name: 'id', description: 'Port ID' })
  @ApiResponse({ status: 200, description: 'Port retrieved successfully', type: PortResponseDto })
  @ApiResponse({ status: 404, description: 'Port not found' })
  @SetMetadata('scopes', ['ports:read'])
  findOne(@Param('id') id: string) {
    return this.portsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a port' })
  @ApiParam({ name: 'id', description: 'Port ID' })
  @ApiResponse({ status: 200, description: 'Port updated successfully', type: PortResponseDto })
  @ApiResponse({ status: 404, description: 'Port not found' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid port number or category not found' })
  @SetMetadata('scopes', ['ports:write'])
  update(@Param('id') id: string, @Body() updatePortDto: UpdatePortDto) {
    return this.portsService.update(id, updatePortDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a port' })
  @ApiParam({ name: 'id', description: 'Port ID' })
  @ApiResponse({ status: 200, description: 'Port deleted successfully' })
  @ApiResponse({ status: 404, description: 'Port not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete port bound to instances' })
  @SetMetadata('scopes', ['ports:write'])
  remove(@Param('id') id: string) {
    return this.portsService.remove(id);
  }
}
