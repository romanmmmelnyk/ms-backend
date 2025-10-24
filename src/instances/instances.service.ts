import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInstanceDto } from './dto/create-instance.dto';
import { UpdateInstanceDto } from './dto/update-instance.dto';
import { BindPortDto, PortBindingResponseDto } from './dto/port-binding.dto';

@Injectable()
export class InstancesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.instance.findMany({
      include: {
        hosting: true,
        sites: true,
        domains: true,
        ports: {
          include: {
            port: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const instance = await this.prisma.instance.findUnique({
      where: { id },
      include: {
        hosting: true,
        sites: true,
        domains: true,
        ports: {
          include: {
            port: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!instance) {
      throw new NotFoundException(`Instance with ID ${id} not found`);
    }

    return instance;
  }

  async create(createInstanceDto: CreateInstanceDto) {
    // Validate that the hosting exists
    const hosting = await this.prisma.hosting.findUnique({
      where: { id: createInstanceDto.hostingId },
    });

    if (!hosting) {
      throw new BadRequestException(`Hosting with ID ${createInstanceDto.hostingId} not found`);
    }

    return this.prisma.instance.create({
      data: createInstanceDto,
      include: {
        hosting: true,
        sites: true,
        domains: true,
        ports: {
          include: {
            port: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, updateInstanceDto: UpdateInstanceDto) {
    // Check if instance exists
    const existingInstance = await this.prisma.instance.findUnique({
      where: { id },
    });

    if (!existingInstance) {
      throw new NotFoundException(`Instance with ID ${id} not found`);
    }

    // Validate hosting if provided
    if (updateInstanceDto.hostingId) {
      const hosting = await this.prisma.hosting.findUnique({
        where: { id: updateInstanceDto.hostingId },
      });

      if (!hosting) {
        throw new BadRequestException(`Hosting with ID ${updateInstanceDto.hostingId} not found`);
      }
    }

    return this.prisma.instance.update({
      where: { id },
      data: updateInstanceDto,
      include: {
        hosting: true,
        sites: true,
        domains: true,
        ports: {
          include: {
            port: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(id: string) {
    // Check if instance exists
    const existingInstance = await this.prisma.instance.findUnique({
      where: { id },
    });

    if (!existingInstance) {
      throw new NotFoundException(`Instance with ID ${id} not found`);
    }

    // Check if instance has any sites or domains
    const sitesCount = await this.prisma.site.count({
      where: { instanceId: id },
    });

    const domainsCount = await this.prisma.domain.count({
      where: { instanceId: id },
    });

    if (sitesCount > 0) {
      throw new BadRequestException(`Cannot delete instance with ${sitesCount} associated sites`);
    }

    if (domainsCount > 0) {
      throw new BadRequestException(`Cannot delete instance with ${domainsCount} associated domains`);
    }

    return this.prisma.instance.delete({
      where: { id },
    });
  }

  async bindPort(id: string, bindPortDto: BindPortDto): Promise<PortBindingResponseDto> {
    // Check if instance exists
    const instance = await this.prisma.instance.findUnique({
      where: { id },
    });

    if (!instance) {
      throw new NotFoundException(`Instance with ID ${id} not found`);
    }

    // Check if port exists
    const port = await this.prisma.port.findUnique({
      where: { id: bindPortDto.portId },
    });

    if (!port) {
      throw new BadRequestException(`Port with ID ${bindPortDto.portId} not found`);
    }

    // Check if port is already bound to this instance
    const existingBinding = await this.prisma.instancePort.findUnique({
      where: {
        instanceId_portId: {
          instanceId: id,
          portId: bindPortDto.portId,
        },
      },
    });

    if (existingBinding) {
      throw new BadRequestException(`Port ${bindPortDto.portId} is already bound to this instance`);
    }

    // Create the port binding
    await this.prisma.instancePort.create({
      data: {
        instanceId: id,
        portId: bindPortDto.portId,
      },
    });

    // Update port bindings in instance
    const currentBindings = instance.portBindings as any || {};
    const bindingConfig = {
      protocol: bindPortDto.protocol,
      hostPort: bindPortDto.hostPort || port.number,
      boundAt: new Date().toISOString(),
    };

    currentBindings[bindPortDto.portId] = bindingConfig;

    await this.prisma.instance.update({
      where: { id },
      data: {
        portBindings: currentBindings,
      },
    });

    return {
      portId: bindPortDto.portId,
      protocol: bindPortDto.protocol,
      hostPort: bindPortDto.hostPort || port.number,
      binding: bindingConfig,
      boundAt: new Date(),
    };
  }

  async unbindPort(id: string, portId: string) {
    // Check if instance exists
    const instance = await this.prisma.instance.findUnique({
      where: { id },
    });

    if (!instance) {
      throw new NotFoundException(`Instance with ID ${id} not found`);
    }

    // Check if port binding exists
    const existingBinding = await this.prisma.instancePort.findUnique({
      where: {
        instanceId_portId: {
          instanceId: id,
          portId: portId,
        },
      },
    });

    if (!existingBinding) {
      throw new NotFoundException(`Port ${portId} is not bound to this instance`);
    }

    // Remove the port binding
    await this.prisma.instancePort.delete({
      where: {
        instanceId_portId: {
          instanceId: id,
          portId: portId,
        },
      },
    });

    // Update port bindings in instance
    const currentBindings = instance.portBindings as any || {};
    delete currentBindings[portId];

    await this.prisma.instance.update({
      where: { id },
      data: {
        portBindings: currentBindings,
      },
    });

    return {
      message: `Port ${portId} has been unbound from instance ${id}`,
      unboundAt: new Date(),
    };
  }
}
