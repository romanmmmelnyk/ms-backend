import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { EnquiriesModule } from './enquiries/enquiries.module';
import { SitesModule } from './sites/sites.module';
import { InstancesModule } from './instances/instances.module';
import { DomainsModule } from './domains/domains.module';
import { PortsModule } from './ports/ports.module';
import { PortCategoriesModule } from './port-categories/port-categories.module';
import { HostingsModule } from './hostings/hostings.module';

@Module({
  imports: [PrismaModule, EnquiriesModule, SitesModule, InstancesModule, DomainsModule, PortsModule, PortCategoriesModule, HostingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

