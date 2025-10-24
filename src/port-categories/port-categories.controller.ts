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
import { PortCategoriesService } from './port-categories.service';
import { CreatePortCategoryDto } from './dto/create-port-category.dto';
import { UpdatePortCategoryDto } from './dto/update-port-category.dto';
import { PortCategoryResponseDto } from './dto/port-category-response.dto';

// TODO: Implement proper authentication guard
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
@ApiTags('port-categories')
@Controller('api/port-categories')
export class PortCategoriesController {
  constructor(private readonly portCategoriesService: PortCategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new port category' })
  @ApiResponse({ status: 201, description: 'Port category created successfully', type: PortCategoryResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - category name already exists' })
  @SetMetadata('scopes', ['port-categories:write'])
  create(@Body() createPortCategoryDto: CreatePortCategoryDto) {
    return this.portCategoriesService.create(createPortCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all port categories' })
  @ApiResponse({ status: 200, description: 'Port categories retrieved successfully', type: [PortCategoryResponseDto] })
  @SetMetadata('scopes', ['port-categories:read'])
  findAll() {
    return this.portCategoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a port category by ID' })
  @ApiParam({ name: 'id', description: 'Port category ID' })
  @ApiResponse({ status: 200, description: 'Port category retrieved successfully', type: PortCategoryResponseDto })
  @ApiResponse({ status: 404, description: 'Port category not found' })
  @SetMetadata('scopes', ['port-categories:read'])
  findOne(@Param('id') id: string) {
    return this.portCategoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a port category' })
  @ApiParam({ name: 'id', description: 'Port category ID' })
  @ApiResponse({ status: 200, description: 'Port category updated successfully', type: PortCategoryResponseDto })
  @ApiResponse({ status: 404, description: 'Port category not found' })
  @ApiResponse({ status: 400, description: 'Bad request - category name already exists' })
  @SetMetadata('scopes', ['port-categories:write'])
  update(@Param('id') id: string, @Body() updatePortCategoryDto: UpdatePortCategoryDto) {
    return this.portCategoriesService.update(id, updatePortCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a port category' })
  @ApiParam({ name: 'id', description: 'Port category ID' })
  @ApiResponse({ status: 200, description: 'Port category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Port category not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete category with associated ports' })
  @SetMetadata('scopes', ['port-categories:write'])
  remove(@Param('id') id: string) {
    return this.portCategoriesService.remove(id);
  }
}
