import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { EnquiryResponseDto } from './dto/enquiry-response.dto';

@Injectable()
export class EnquiriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEnquiryDto: CreateEnquiryDto): Promise<EnquiryResponseDto> {
    try {
      const enquiry = await this.prisma.enquiry.create({
        data: {
          firstName: createEnquiryDto.firstName,
          lastName: createEnquiryDto.lastName,
          email: createEnquiryDto.email,
          company: createEnquiryDto.company,
          projectType: createEnquiryDto.projectType,
          budget: createEnquiryDto.budget,
          timeline: createEnquiryDto.timeline,
          message: createEnquiryDto.message,
          newsletter: createEnquiryDto.newsletter ?? false,
        },
      });

      return new EnquiryResponseDto(enquiry);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create enquiry');
    }
  }

  async findAll(): Promise<EnquiryResponseDto[]> {
    try {
      const enquiries = await this.prisma.enquiry.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      return enquiries.map((enquiry) => new EnquiryResponseDto(enquiry));
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch enquiries');
    }
  }

  async findOne(id: string): Promise<EnquiryResponseDto> {
    try {
      const enquiry = await this.prisma.enquiry.findUnique({
        where: { id },
      });

      if (!enquiry) {
        return null;
      }

      return new EnquiryResponseDto(enquiry);
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch enquiry');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.enquiry.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete enquiry');
    }
  }
}

