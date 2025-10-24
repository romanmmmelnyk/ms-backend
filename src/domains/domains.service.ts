import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';
import { DomainQueryDto } from './dto/domain-response.dto';
import { DomainRenewalResponseDto } from './dto/domain-renewal.dto';

@Injectable()
export class DomainsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: DomainQueryDto) {
    const where: any = {};

    // Filter by provider
    if (query.provider) {
      where.provider = {
        contains: query.provider,
        mode: 'insensitive',
      };
    }

    // Filter by expiring domains
    if (query.expiringInDays) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + query.expiringInDays);
      
      where.paidUntil = {
        lte: expirationDate,
        gte: new Date(), // Only future dates
      };
    }

    return this.prisma.domain.findMany({
      where,
      include: {
        instance: true,
        sites: true,
        primaryForSites: true,
      },
      orderBy: {
        paidUntil: 'asc', // Show expiring domains first
      },
    });
  }

  async findOne(id: string) {
    const domain = await this.prisma.domain.findUnique({
      where: { id },
      include: {
        instance: true,
        sites: true,
        primaryForSites: true,
      },
    });

    if (!domain) {
      throw new NotFoundException(`Domain with ID ${id} not found`);
    }

    return domain;
  }

  async create(createDomainDto: CreateDomainDto) {
    // Validate that the instance exists
    const instance = await this.prisma.instance.findUnique({
      where: { id: createDomainDto.instanceId },
    });

    if (!instance) {
      throw new BadRequestException(`Instance with ID ${createDomainDto.instanceId} not found`);
    }

    // Validate DNS name format (basic validation)
    if (!this.isValidDnsName(createDomainDto.name)) {
      throw new BadRequestException(`Invalid DNS name format: ${createDomainDto.name}`);
    }

    // Check if domain name already exists
    const existingDomain = await this.prisma.domain.findUnique({
      where: { name: createDomainDto.name },
    });

    if (existingDomain) {
      throw new BadRequestException(`Domain ${createDomainDto.name} already exists`);
    }

    return this.prisma.domain.create({
      data: {
        ...createDomainDto,
        paidUntil: createDomainDto.paidUntil ? new Date(createDomainDto.paidUntil) : null,
        currency: createDomainDto.currency || 'USD',
        autoRenew: createDomainDto.autoRenew || false,
      },
      include: {
        instance: true,
        sites: true,
        primaryForSites: true,
      },
    });
  }

  async update(id: string, updateDomainDto: UpdateDomainDto) {
    // Check if domain exists
    const existingDomain = await this.prisma.domain.findUnique({
      where: { id },
    });

    if (!existingDomain) {
      throw new NotFoundException(`Domain with ID ${id} not found`);
    }

    // Validate instance if provided
    if (updateDomainDto.instanceId) {
      const instance = await this.prisma.instance.findUnique({
        where: { id: updateDomainDto.instanceId },
      });

      if (!instance) {
        throw new BadRequestException(`Instance with ID ${updateDomainDto.instanceId} not found`);
      }
    }

    // Validate DNS name format if provided
    if (updateDomainDto.name && !this.isValidDnsName(updateDomainDto.name)) {
      throw new BadRequestException(`Invalid DNS name format: ${updateDomainDto.name}`);
    }

    // Check if new domain name already exists (if changing name)
    if (updateDomainDto.name && updateDomainDto.name !== existingDomain.name) {
      const existingDomainWithName = await this.prisma.domain.findUnique({
        where: { name: updateDomainDto.name },
      });

      if (existingDomainWithName) {
        throw new BadRequestException(`Domain ${updateDomainDto.name} already exists`);
      }
    }

    return this.prisma.domain.update({
      where: { id },
      data: {
        ...updateDomainDto,
        paidUntil: updateDomainDto.paidUntil ? new Date(updateDomainDto.paidUntil) : undefined,
      },
      include: {
        instance: true,
        sites: true,
        primaryForSites: true,
      },
    });
  }

  async remove(id: string) {
    // Check if domain exists
    const existingDomain = await this.prisma.domain.findUnique({
      where: { id },
    });

    if (!existingDomain) {
      throw new NotFoundException(`Domain with ID ${id} not found`);
    }

    // Check if domain is used as primary domain for any sites
    const primarySitesCount = await this.prisma.site.count({
      where: { primaryDomainId: id },
    });

    if (primarySitesCount > 0) {
      throw new BadRequestException(`Cannot delete domain used as primary domain for ${primarySitesCount} sites`);
    }

    return this.prisma.domain.delete({
      where: { id },
    });
  }

  async renew(id: string): Promise<DomainRenewalResponseDto> {
    // Check if domain exists
    const domain = await this.prisma.domain.findUnique({
      where: { id },
    });

    if (!domain) {
      throw new NotFoundException(`Domain with ID ${id} not found`);
    }

    // Calculate renewal amount
    const renewalAmount = domain.priceYear ? Number(domain.priceYear) : 0;
    const currency = domain.currency || 'USD';

    // TODO: Integrate with actual billing system
    // For now, simulate a successful renewal
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Calculate new expiration date (1 year from now or current expiration)
    const currentExpiration = domain.paidUntil || new Date();
    const newExpirationDate = new Date(currentExpiration);
    newExpirationDate.setFullYear(newExpirationDate.getFullYear() + 1);

    // Update domain with new expiration date
    const updatedDomain = await this.prisma.domain.update({
      where: { id },
      data: {
        paidUntil: newExpirationDate,
      },
    });

    // TODO: Emit domain.renewed event
    // await this.eventEmitter.emit('domain.renewed', {
    //   domainId: id,
    //   domainName: domain.name,
    //   newExpirationDate,
    //   renewalAmount,
    //   currency,
    //   transactionId,
    // });

    return {
      domainId: id,
      domainName: domain.name,
      newExpirationDate,
      renewalAmount,
      currency,
      renewedAt: new Date(),
      transactionId,
    };
  }

  private isValidDnsName(name: string): boolean {
    // DNS name regex: ^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$
    const dnsRegex = /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/;
    return dnsRegex.test(name);
  }
}
