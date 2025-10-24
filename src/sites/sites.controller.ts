import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SitesService } from './sites.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { SiteQueryDto } from './dto/site-query.dto';
import { SiteResponseDto } from './dto/site-response.dto';
import { ExpandedSiteResponseDto } from './dto/expanded-site-response.dto';

// TODO: Implement proper authentication guard
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
@ApiTags('sites')
@Controller('api/sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new site' })
  @ApiResponse({ status: 201, description: 'Site created successfully', type: SiteResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @SetMetadata('scopes', ['sites:write'])
  create(@Body() createSiteDto: CreateSiteDto) {
    return this.sitesService.create(createSiteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sites with optional filters' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by site status' })
  @ApiQuery({ name: 'domain', required: false, description: 'Filter by domain name' })
  @ApiQuery({ name: 'instance', required: false, description: 'Filter by instance ID' })
  @ApiResponse({ status: 200, description: 'Sites retrieved successfully', type: [SiteResponseDto] })
  @SetMetadata('scopes', ['sites:read'])
  findAll(@Query() query: SiteQueryDto) {
    return this.sitesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a site by ID' })
  @ApiParam({ name: 'id', description: 'Site ID' })
  @ApiResponse({ status: 200, description: 'Site retrieved successfully', type: SiteResponseDto })
  @ApiResponse({ status: 404, description: 'Site not found' })
  @SetMetadata('scopes', ['sites:read'])
  findOne(@Param('id') id: string) {
    return this.sitesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a site' })
  @ApiParam({ name: 'id', description: 'Site ID' })
  @ApiResponse({ status: 200, description: 'Site updated successfully', type: SiteResponseDto })
  @ApiResponse({ status: 404, description: 'Site not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @SetMetadata('scopes', ['sites:write'])
  update(@Param('id') id: string, @Body() updateSiteDto: UpdateSiteDto) {
    return this.sitesService.update(id, updateSiteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a site' })
  @ApiParam({ name: 'id', description: 'Site ID' })
  @ApiResponse({ status: 200, description: 'Site deleted successfully' })
  @ApiResponse({ status: 404, description: 'Site not found' })
  @SetMetadata('scopes', ['sites:write'])
  remove(@Param('id') id: string) {
    return this.sitesService.remove(id);
  }

  @Get(':id/expand')
  @ApiOperation({ summary: 'Get expanded site information including instance, domains, ports, and hosting' })
  @ApiParam({ name: 'id', description: 'Site ID' })
  @ApiResponse({ status: 200, description: 'Expanded site information retrieved successfully', type: ExpandedSiteResponseDto })
  @ApiResponse({ status: 404, description: 'Site not found' })
  @SetMetadata('scopes', ['sites:read'])
  findExpanded(@Param('id') id: string) {
    return this.sitesService.findExpanded(id);
  }

  @Post(':id/actions/fetch-siteinfo')
  @ApiOperation({ summary: 'Fetch site information on-demand' })
  @ApiParam({ name: 'id', description: 'Site ID' })
  @ApiResponse({ status: 200, description: 'Site information fetched successfully' })
  @ApiResponse({ status: 404, description: 'Site not found' })
  @SetMetadata('scopes', ['sites:write'])
  fetchSiteInfo(@Param('id') id: string) {
    // TODO: Get user ID from authentication context
    const fetchedBy = 'system'; // Placeholder
    return this.sitesService.fetchSiteInfo(id, fetchedBy);
  }
}
