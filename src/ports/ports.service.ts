import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePortDto } from './dto/create-port.dto';
import { UpdatePortDto } from './dto/update-port.dto';

@Injectable()
export class PortsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.port.findMany({
      include: {
        category: true,
        instances: {
          include: {
            instance: true,
          },
        },
      },
      orderBy: {
        number: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const port = await this.prisma.port.findUnique({
      where: { id },
      include: {
        category: true,
        instances: {
          include: {
            instance: true,
          },
        },
      },
    });

    if (!port) {
      throw new NotFoundException(`Port with ID ${id} not found`);
    }

    return port;
  }

  async create(createPortDto: CreatePortDto) {
    // Validate that the category exists
    const category = await this.prisma.portCategory.findUnique({
      where: { id: createPortDto.categoryId },
    });

    if (!category) {
      throw new BadRequestException(`Port category with ID ${createPortDto.categoryId} not found`);
    }

    // Check if port number already exists
    const existingPort = await this.prisma.port.findUnique({
      where: { number: createPortDto.number },
    });

    if (existingPort) {
      throw new BadRequestException(`Port number ${createPortDto.number} already exists`);
    }

    return this.prisma.port.create({
      data: createPortDto,
      include: {
        category: true,
        instances: {
          include: {
            instance: true,
          },
        },
      },
    });
  }

  async update(id: string, updatePortDto: UpdatePortDto) {
    // Check if port exists
    const existingPort = await this.prisma.port.findUnique({
      where: { id },
    });

    if (!existingPort) {
      throw new NotFoundException(`Port with ID ${id} not found`);
    }

    // Validate category if provided
    if (updatePortDto.categoryId) {
      const category = await this.prisma.portCategory.findUnique({
        where: { id: updatePortDto.categoryId },
      });

      if (!category) {
        throw new BadRequestException(`Port category with ID ${updatePortDto.categoryId} not found`);
      }
    }

    // Check if new port number already exists (if changing number)
    if (updatePortDto.number && updatePortDto.number !== existingPort.number) {
      const existingPortWithNumber = await this.prisma.port.findUnique({
        where: { number: updatePortDto.number },
      });

      if (existingPortWithNumber) {
        throw new BadRequestException(`Port number ${updatePortDto.number} already exists`);
      }
    }

    return this.prisma.port.update({
      where: { id },
      data: updatePortDto,
      include: {
        category: true,
        instances: {
          include: {
            instance: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    // Check if port exists
    const existingPort = await this.prisma.port.findUnique({
      where: { id },
    });

    if (!existingPort) {
      throw new NotFoundException(`Port with ID ${id} not found`);
    }

    // Check if port is bound to any instances
    const instancesCount = await this.prisma.instancePort.count({
      where: { portId: id },
    });

    if (instancesCount > 0) {
      throw new BadRequestException(`Cannot delete port bound to ${instancesCount} instances. Unbind the port first.`);
    }

    return this.prisma.port.delete({
      where: { id },
    });
  }
}
