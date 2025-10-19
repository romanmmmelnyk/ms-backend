import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { EnquiriesService } from './enquiries.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { EnquiryResponseDto } from './dto/enquiry-response.dto';

@Controller('enquiries')
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createEnquiryDto: CreateEnquiryDto,
  ): Promise<{ message: string; data: EnquiryResponseDto }> {
    const enquiry = await this.enquiriesService.create(createEnquiryDto);
    return {
      message: 'Enquiry submitted successfully',
      data: enquiry,
    };
  }

  @Get()
  async findAll(): Promise<{ data: EnquiryResponseDto[] }> {
    const enquiries = await this.enquiriesService.findAll();
    return { data: enquiries };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<{ data: EnquiryResponseDto }> {
    const enquiry = await this.enquiriesService.findOne(id);
    if (!enquiry) {
      throw new NotFoundException(`Enquiry with ID ${id} not found`);
    }
    return { data: enquiry };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    const enquiry = await this.enquiriesService.findOne(id);
    if (!enquiry) {
      throw new NotFoundException(`Enquiry with ID ${id} not found`);
    }
    await this.enquiriesService.remove(id);
  }
}

