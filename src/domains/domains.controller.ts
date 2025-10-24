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
import { DomainsService } from './domains.service';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';
import { DomainQueryDto, DomainResponseDto } from './dto/domain-response.dto';
import { DomainRenewalResponseDto } from './dto/domain-renewal.dto';

// TODO: Implement proper authentication guard
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
@ApiTags('domains')
@Controller('api/domains')
export class DomainsController {
  constructor(private readonly domainsService: DomainsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new domain' })
  @ApiResponse({ status: 201, description: 'Domain created successfully', type: DomainResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - invalid DNS name or instance not found' })
  @SetMetadata('scopes', ['domains:write'])
  create(@Body() createDomainDto: CreateDomainDto) {
    return this.domainsService.create(createDomainDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all domains with optional filters' })
  @ApiQuery({ name: 'expiringInDays', required: false, description: 'Filter domains expiring within this many days' })
  @ApiQuery({ name: 'provider', required: false, description: 'Filter by domain provider' })
  @ApiResponse({ status: 200, description: 'Domains retrieved successfully', type: [DomainResponseDto] })
  @SetMetadata('scopes', ['domains:billing'])
  findAll(@Query() query: DomainQueryDto) {
    return this.domainsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a domain by ID' })
  @ApiParam({ name: 'id', description: 'Domain ID' })
  @ApiResponse({ status: 200, description: 'Domain retrieved successfully', type: DomainResponseDto })
  @ApiResponse({ status: 404, description: 'Domain not found' })
  @SetMetadata('scopes', ['domains:billing'])
  findOne(@Param('id') id: string) {
    return this.domainsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a domain' })
  @ApiParam({ name: 'id', description: 'Domain ID' })
  @ApiResponse({ status: 200, description: 'Domain updated successfully', type: DomainResponseDto })
  @ApiResponse({ status: 404, description: 'Domain not found' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid DNS name or instance not found' })
  @SetMetadata('scopes', ['domains:write'])
  update(@Param('id') id: string, @Body() updateDomainDto: UpdateDomainDto) {
    return this.domainsService.update(id, updateDomainDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a domain' })
  @ApiParam({ name: 'id', description: 'Domain ID' })
  @ApiResponse({ status: 200, description: 'Domain deleted successfully' })
  @ApiResponse({ status: 404, description: 'Domain not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete domain used as primary domain' })
  @SetMetadata('scopes', ['domains:write'])
  remove(@Param('id') id: string) {
    return this.domainsService.remove(id);
  }

  @Post(':id/actions/renew')
  @ApiOperation({ summary: 'Renew domain for 1 year' })
  @ApiParam({ name: 'id', description: 'Domain ID' })
  @ApiResponse({ status: 200, description: 'Domain renewed successfully', type: DomainRenewalResponseDto })
  @ApiResponse({ status: 404, description: 'Domain not found' })
  @ApiResponse({ status: 400, description: 'Renewal failed' })
  @SetMetadata('scopes', ['domains:billing'])
  renew(@Param('id') id: string) {
    return this.domainsService.renew(id);
  }
}
