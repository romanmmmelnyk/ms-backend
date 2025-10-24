import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSiteDto, SiteStatus } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { SiteQueryDto } from './dto/site-query.dto';

@Injectable()
export class SitesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: SiteQueryDto) {
    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.instance) {
      where.instanceId = query.instance;
    }

    if (query.domain) {
      where.domains = {
        some: {
          name: {
            contains: query.domain,
            mode: 'insensitive',
          },
        },
      };
    }

    return this.prisma.site.findMany({
      where,
      include: {
        instance: true,
        domains: true,
        primaryDomain: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const site = await this.prisma.site.findUnique({
      where: { id },
      include: {
        instance: true,
        domains: true,
        primaryDomain: true,
        siteInfo: true,
      },
    });

    if (!site) {
      throw new NotFoundException(`Site with ID ${id} not found`);
    }

    return site;
  }

  async create(createSiteDto: CreateSiteDto) {
    // Validate that the instance exists
    const instance = await this.prisma.instance.findUnique({
      where: { id: createSiteDto.instanceId },
    });

    if (!instance) {
      throw new BadRequestException(`Instance with ID ${createSiteDto.instanceId} not found`);
    }

    // Validate primary domain if provided
    if (createSiteDto.primaryDomainId) {
      const domain = await this.prisma.domain.findUnique({
        where: { id: createSiteDto.primaryDomainId },
      });

      if (!domain) {
        throw new BadRequestException(`Domain with ID ${createSiteDto.primaryDomainId} not found`);
      }
    }

    return this.prisma.site.create({
      data: {
        ...createSiteDto,
        status: createSiteDto.status || SiteStatus.ACTIVE,
      },
      include: {
        instance: true,
        domains: true,
        primaryDomain: true,
      },
    });
  }

  async update(id: string, updateSiteDto: UpdateSiteDto) {
    // Check if site exists
    const existingSite = await this.prisma.site.findUnique({
      where: { id },
    });

    if (!existingSite) {
      throw new NotFoundException(`Site with ID ${id} not found`);
    }

    // Validate instance if provided
    if (updateSiteDto.instanceId) {
      const instance = await this.prisma.instance.findUnique({
        where: { id: updateSiteDto.instanceId },
      });

      if (!instance) {
        throw new BadRequestException(`Instance with ID ${updateSiteDto.instanceId} not found`);
      }
    }

    // Validate primary domain if provided
    if (updateSiteDto.primaryDomainId) {
      const domain = await this.prisma.domain.findUnique({
        where: { id: updateSiteDto.primaryDomainId },
      });

      if (!domain) {
        throw new BadRequestException(`Domain with ID ${updateSiteDto.primaryDomainId} not found`);
      }
    }

    return this.prisma.site.update({
      where: { id },
      data: updateSiteDto,
      include: {
        instance: true,
        domains: true,
        primaryDomain: true,
      },
    });
  }

  async remove(id: string) {
    // Check if site exists
    const existingSite = await this.prisma.site.findUnique({
      where: { id },
    });

    if (!existingSite) {
      throw new NotFoundException(`Site with ID ${id} not found`);
    }

    return this.prisma.site.delete({
      where: { id },
    });
  }

  async findExpanded(id: string) {
    const site = await this.prisma.site.findUnique({
      where: { id },
      include: {
        instance: {
          include: {
            hosting: true,
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
        },
        domains: true,
        primaryDomain: true,
        siteInfo: true,
      },
    });

    if (!site) {
      throw new NotFoundException(`Site with ID ${id} not found`);
    }

    return {
      site: {
        id: site.id,
        name: site.name,
        purpose: site.purpose,
        instanceId: site.instanceId,
        primaryDomainId: site.primaryDomainId,
        analytics: site.analytics,
        status: site.status,
        createdAt: site.createdAt,
        updatedAt: site.updatedAt,
      },
      instance: {
        id: site.instance.id,
        name: site.instance.name,
        hostingId: site.instance.hostingId,
        ipAddress: site.instance.ipAddress,
        portBindings: site.instance.portBindings,
        createdAt: site.instance.createdAt,
        updatedAt: site.instance.updatedAt,
      },
      domains: site.domains.map(domain => ({
        id: domain.id,
        name: domain.name,
        provider: domain.provider,
        paidUntil: domain.paidUntil,
        priceYear: domain.priceYear,
        currency: domain.currency,
        autoRenew: domain.autoRenew,
        createdAt: domain.createdAt,
      })),
      ports: site.instance.ports.map(instancePort => ({
        id: instancePort.port.id,
        number: instancePort.port.number,
        categoryId: instancePort.port.categoryId,
        description: instancePort.port.description,
        category: {
          id: instancePort.port.category.id,
          name: instancePort.port.category.name,
          description: instancePort.port.category.description,
        },
      })),
      hosting: {
        id: site.instance.hosting.id,
        providerName: site.instance.hosting.providerName,
        providerAccount: site.instance.hosting.providerAccount,
        priceYear: site.instance.hosting.priceYear,
        paidAt: site.instance.hosting.paidAt,
        currency: site.instance.hosting.currency,
        createdAt: site.instance.hosting.createdAt,
        updatedAt: site.instance.hosting.updatedAt,
      },
    };
  }

  async fetchSiteInfo(id: string, fetchedBy: string) {
    // Check if site exists
    const site = await this.prisma.site.findUnique({
      where: { id },
    });

    if (!site) {
      throw new NotFoundException(`Site with ID ${id} not found`);
    }

    // TODO: Implement actual site info fetching logic
    // This would typically involve:
    // 1. Making HTTP requests to the site
    // 2. Parsing HTML/JSON responses
    // 3. Extracting contact information
    // 4. Storing the results

    // For now, return a placeholder response
    const mockSiteInfo = {
      contacts: {
        phones: ['+1234567890'],
        emails: ['contact@example.com'],
      },
      meta: {
        fetched_by: fetchedBy,
        fetched_at: new Date().toISOString(),
      },
      sourceUrl: `https://${site.name}`,
      rawJson: null,
    };

    // Upsert site info
    return this.prisma.siteInfo.upsert({
      where: { siteId: id },
      update: {
        contacts: mockSiteInfo.contacts,
        meta: mockSiteInfo.meta,
        sourceUrl: mockSiteInfo.sourceUrl,
        rawJson: mockSiteInfo.rawJson,
      },
      create: {
        siteId: id,
        contacts: mockSiteInfo.contacts,
        meta: mockSiteInfo.meta,
        sourceUrl: mockSiteInfo.sourceUrl,
        rawJson: mockSiteInfo.rawJson,
      },
    });
  }
}
