import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHostingDto } from './dto/create-hosting.dto';
import { UpdateHostingDto } from './dto/update-hosting.dto';

@Injectable()
export class HostingsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const hostings = await this.prisma.hosting.findMany({
      include: {
        instances: {
          select: {
            id: true,
            name: true,
            ipAddress: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        providerName: 'asc',
      },
    });

    return hostings.map(hosting => ({
      id: hosting.id,
      providerName: hosting.providerName,
      providerAccount: hosting.providerAccount,
      priceYear: hosting.priceYear ? Number(hosting.priceYear) : undefined,
      paidAt: hosting.paidAt,
      currency: hosting.currency,
      createdAt: hosting.createdAt,
      updatedAt: hosting.updatedAt,
      instances: hosting.instances,
      instanceCount: hosting.instances.length,
    }));
  }

  async findOne(id: string) {
    const hosting = await this.prisma.hosting.findUnique({
      where: { id },
      include: {
        instances: {
          select: {
            id: true,
            name: true,
            ipAddress: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!hosting) {
      throw new NotFoundException(`Hosting with ID ${id} not found`);
    }

    return {
      id: hosting.id,
      providerName: hosting.providerName,
      providerAccount: hosting.providerAccount,
      priceYear: hosting.priceYear ? Number(hosting.priceYear) : undefined,
      paidAt: hosting.paidAt,
      currency: hosting.currency,
      createdAt: hosting.createdAt,
      updatedAt: hosting.updatedAt,
      instances: hosting.instances,
      instanceCount: hosting.instances.length,
    };
  }

  async create(createHostingDto: CreateHostingDto) {
    // Check if hosting with same provider and account already exists
    const existingHosting = await this.prisma.hosting.findFirst({
      where: {
        providerName: createHostingDto.providerName,
        providerAccount: createHostingDto.providerAccount,
      },
    });

    if (existingHosting) {
      throw new BadRequestException(`Hosting with provider '${createHostingDto.providerName}' and account '${createHostingDto.providerAccount}' already exists`);
    }

    const hosting = await this.prisma.hosting.create({
      data: {
        ...createHostingDto,
        paidAt: createHostingDto.paidAt ? new Date(createHostingDto.paidAt) : null,
        currency: createHostingDto.currency || 'USD',
      },
      include: {
        instances: {
          select: {
            id: true,
            name: true,
            ipAddress: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    return {
      id: hosting.id,
      providerName: hosting.providerName,
      providerAccount: hosting.providerAccount,
      priceYear: hosting.priceYear ? Number(hosting.priceYear) : undefined,
      paidAt: hosting.paidAt,
      currency: hosting.currency,
      createdAt: hosting.createdAt,
      updatedAt: hosting.updatedAt,
      instances: hosting.instances,
      instanceCount: hosting.instances.length,
    };
  }

  async update(id: string, updateHostingDto: UpdateHostingDto) {
    // Check if hosting exists
    const existingHosting = await this.prisma.hosting.findUnique({
      where: { id },
    });

    if (!existingHosting) {
      throw new NotFoundException(`Hosting with ID ${id} not found`);
    }

    // Check if new provider/account combination already exists (if changing)
    if (updateHostingDto.providerName || updateHostingDto.providerAccount) {
      const newProviderName = updateHostingDto.providerName || existingHosting.providerName;
      const newProviderAccount = updateHostingDto.providerAccount || existingHosting.providerAccount;

      if (newProviderName !== existingHosting.providerName || newProviderAccount !== existingHosting.providerAccount) {
        const existingHostingWithSameDetails = await this.prisma.hosting.findFirst({
          where: {
            providerName: newProviderName,
            providerAccount: newProviderAccount,
            id: { not: id },
          },
        });

        if (existingHostingWithSameDetails) {
          throw new BadRequestException(`Hosting with provider '${newProviderName}' and account '${newProviderAccount}' already exists`);
        }
      }
    }

    const updatedHosting = await this.prisma.hosting.update({
      where: { id },
      data: {
        ...updateHostingDto,
        paidAt: updateHostingDto.paidAt ? new Date(updateHostingDto.paidAt) : undefined,
      },
      include: {
        instances: {
          select: {
            id: true,
            name: true,
            ipAddress: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    return {
      id: updatedHosting.id,
      providerName: updatedHosting.providerName,
      providerAccount: updatedHosting.providerAccount,
      priceYear: updatedHosting.priceYear ? Number(updatedHosting.priceYear) : undefined,
      paidAt: updatedHosting.paidAt,
      currency: updatedHosting.currency,
      createdAt: updatedHosting.createdAt,
      updatedAt: updatedHosting.updatedAt,
      instances: updatedHosting.instances,
      instanceCount: updatedHosting.instances.length,
    };
  }

  async remove(id: string) {
    // Check if hosting exists
    const existingHosting = await this.prisma.hosting.findUnique({
      where: { id },
    });

    if (!existingHosting) {
      throw new NotFoundException(`Hosting with ID ${id} not found`);
    }

    // Check if hosting has any instances
    const instancesCount = await this.prisma.instance.count({
      where: { hostingId: id },
    });

    if (instancesCount > 0) {
      throw new BadRequestException(`Cannot delete hosting with ${instancesCount} associated instances. Delete or reassign the instances first.`);
    }

    return this.prisma.hosting.delete({
      where: { id },
    });
  }
}
