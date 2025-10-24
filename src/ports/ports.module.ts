import { Module } from '@nestjs/common';
import { PortsService } from './ports.service';
import { PortsController } from './ports.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PortsController],
  providers: [PortsService],
  exports: [PortsService],
})
export class PortsModule {}
