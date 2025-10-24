import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePortCategoryDto } from './dto/create-port-category.dto';
import { UpdatePortCategoryDto } from './dto/update-port-category.dto';

@Injectable()
export class PortCategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const categories = await this.prisma.portCategory.findMany({
      include: {
        ports: {
          select: {
            id: true,
            number: true,
            description: true,
          },
          orderBy: {
            number: 'asc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      ports: category.ports,
      portCount: category.ports.length,
    }));
  }

  async findOne(id: string) {
    const category = await this.prisma.portCategory.findUnique({
      where: { id },
      include: {
        ports: {
          select: {
            id: true,
            number: true,
            description: true,
          },
          orderBy: {
            number: 'asc',
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Port category with ID ${id} not found`);
    }

    return {
      id: category.id,
      name: category.name,
      description: category.description,
      ports: category.ports,
      portCount: category.ports.length,
    };
  }

  async create(createPortCategoryDto: CreatePortCategoryDto) {
    // Check if category name already exists
    const existingCategory = await this.prisma.portCategory.findUnique({
      where: { name: createPortCategoryDto.name },
    });

    if (existingCategory) {
      throw new BadRequestException(`Port category with name '${createPortCategoryDto.name}' already exists`);
    }

    return this.prisma.portCategory.create({
      data: createPortCategoryDto,
      include: {
        ports: {
          select: {
            id: true,
            number: true,
            description: true,
          },
          orderBy: {
            number: 'asc',
          },
        },
      },
    });
  }

  async update(id: string, updatePortCategoryDto: UpdatePortCategoryDto) {
    // Check if category exists
    const existingCategory = await this.prisma.portCategory.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException(`Port category with ID ${id} not found`);
    }

    // Check if new name already exists (if changing name)
    if (updatePortCategoryDto.name && updatePortCategoryDto.name !== existingCategory.name) {
      const existingCategoryWithName = await this.prisma.portCategory.findUnique({
        where: { name: updatePortCategoryDto.name },
      });

      if (existingCategoryWithName) {
        throw new BadRequestException(`Port category with name '${updatePortCategoryDto.name}' already exists`);
      }
    }

    const updatedCategory = await this.prisma.portCategory.update({
      where: { id },
      data: updatePortCategoryDto,
      include: {
        ports: {
          select: {
            id: true,
            number: true,
            description: true,
          },
          orderBy: {
            number: 'asc',
          },
        },
      },
    });

    return {
      id: updatedCategory.id,
      name: updatedCategory.name,
      description: updatedCategory.description,
      ports: updatedCategory.ports,
      portCount: updatedCategory.ports.length,
    };
  }

  async remove(id: string) {
    // Check if category exists
    const existingCategory = await this.prisma.portCategory.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException(`Port category with ID ${id} not found`);
    }

    // Check if category has any ports
    const portsCount = await this.prisma.port.count({
      where: { categoryId: id },
    });

    if (portsCount > 0) {
      throw new BadRequestException(`Cannot delete port category with ${portsCount} associated ports. Delete or reassign the ports first.`);
    }

    return this.prisma.portCategory.delete({
      where: { id },
    });
  }
}
