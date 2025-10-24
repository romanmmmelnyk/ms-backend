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
import { HostingsService } from './hostings.service';
import { CreateHostingDto } from './dto/create-hosting.dto';
import { UpdateHostingDto } from './dto/update-hosting.dto';
import { HostingResponseDto } from './dto/hosting-response.dto';

// TODO: Implement proper authentication guard
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
@ApiTags('hostings')
@Controller('api/hostings')
export class HostingsController {
  constructor(private readonly hostingsService: HostingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new hosting provider' })
  @ApiResponse({ status: 201, description: 'Hosting created successfully', type: HostingResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - hosting with same provider/account already exists' })
  @SetMetadata('scopes', ['hostings:write'])
  create(@Body() createHostingDto: CreateHostingDto) {
    return this.hostingsService.create(createHostingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all hosting providers' })
  @ApiResponse({ status: 200, description: 'Hostings retrieved successfully', type: [HostingResponseDto] })
  @SetMetadata('scopes', ['hostings:read'])
  findAll() {
    return this.hostingsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a hosting provider by ID' })
  @ApiParam({ name: 'id', description: 'Hosting ID' })
  @ApiResponse({ status: 200, description: 'Hosting retrieved successfully', type: HostingResponseDto })
  @ApiResponse({ status: 404, description: 'Hosting not found' })
  @SetMetadata('scopes', ['hostings:read'])
  findOne(@Param('id') id: string) {
    return this.hostingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a hosting provider' })
  @ApiParam({ name: 'id', description: 'Hosting ID' })
  @ApiResponse({ status: 200, description: 'Hosting updated successfully', type: HostingResponseDto })
  @ApiResponse({ status: 404, description: 'Hosting not found' })
  @ApiResponse({ status: 400, description: 'Bad request - hosting with same provider/account already exists' })
  @SetMetadata('scopes', ['hostings:write'])
  update(@Param('id') id: string, @Body() updateHostingDto: UpdateHostingDto) {
    return this.hostingsService.update(id, updateHostingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a hosting provider' })
  @ApiParam({ name: 'id', description: 'Hosting ID' })
  @ApiResponse({ status: 200, description: 'Hosting deleted successfully' })
  @ApiResponse({ status: 404, description: 'Hosting not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete hosting with associated instances' })
  @SetMetadata('scopes', ['hostings:write'])
  remove(@Param('id') id: string) {
    return this.hostingsService.remove(id);
  }
}
