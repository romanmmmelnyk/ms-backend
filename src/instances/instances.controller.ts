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
import { InstancesService } from './instances.service';
import { CreateInstanceDto } from './dto/create-instance.dto';
import { UpdateInstanceDto } from './dto/update-instance.dto';
import { InstanceResponseDto } from './dto/instance-response.dto';
import { BindPortDto, PortBindingResponseDto } from './dto/port-binding.dto';

// TODO: Implement proper authentication guard
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
@ApiTags('instances')
@Controller('api/instances')
export class InstancesController {
  constructor(private readonly instancesService: InstancesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new instance' })
  @ApiResponse({ status: 201, description: 'Instance created successfully', type: InstanceResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @SetMetadata('scopes', ['instances:manage'])
  create(@Body() createInstanceDto: CreateInstanceDto) {
    return this.instancesService.create(createInstanceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all instances' })
  @ApiResponse({ status: 200, description: 'Instances retrieved successfully', type: [InstanceResponseDto] })
  @SetMetadata('scopes', ['instances:manage'])
  findAll() {
    return this.instancesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an instance by ID' })
  @ApiParam({ name: 'id', description: 'Instance ID' })
  @ApiResponse({ status: 200, description: 'Instance retrieved successfully', type: InstanceResponseDto })
  @ApiResponse({ status: 404, description: 'Instance not found' })
  @SetMetadata('scopes', ['instances:manage'])
  findOne(@Param('id') id: string) {
    return this.instancesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an instance' })
  @ApiParam({ name: 'id', description: 'Instance ID' })
  @ApiResponse({ status: 200, description: 'Instance updated successfully', type: InstanceResponseDto })
  @ApiResponse({ status: 404, description: 'Instance not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @SetMetadata('scopes', ['instances:manage'])
  update(@Param('id') id: string, @Body() updateInstanceDto: UpdateInstanceDto) {
    return this.instancesService.update(id, updateInstanceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an instance' })
  @ApiParam({ name: 'id', description: 'Instance ID' })
  @ApiResponse({ status: 200, description: 'Instance deleted successfully' })
  @ApiResponse({ status: 404, description: 'Instance not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete instance with associated sites/domains' })
  @SetMetadata('scopes', ['instances:manage'])
  remove(@Param('id') id: string) {
    return this.instancesService.remove(id);
  }

  @Post(':id/ports')
  @ApiOperation({ summary: 'Bind a port to an instance' })
  @ApiParam({ name: 'id', description: 'Instance ID' })
  @ApiResponse({ status: 201, description: 'Port bound successfully', type: PortBindingResponseDto })
  @ApiResponse({ status: 404, description: 'Instance or port not found' })
  @ApiResponse({ status: 400, description: 'Port already bound or invalid request' })
  @SetMetadata('scopes', ['instances:manage'])
  bindPort(@Param('id') id: string, @Body() bindPortDto: BindPortDto) {
    return this.instancesService.bindPort(id, bindPortDto);
  }

  @Delete(':id/ports/:portId')
  @ApiOperation({ summary: 'Unbind a port from an instance' })
  @ApiParam({ name: 'id', description: 'Instance ID' })
  @ApiParam({ name: 'portId', description: 'Port ID' })
  @ApiResponse({ status: 200, description: 'Port unbound successfully' })
  @ApiResponse({ status: 404, description: 'Instance or port binding not found' })
  @SetMetadata('scopes', ['instances:manage'])
  unbindPort(@Param('id') id: string, @Param('portId') portId: string) {
    return this.instancesService.unbindPort(id, portId);
  }
}
