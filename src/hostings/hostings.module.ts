import { Module } from '@nestjs/common';
import { HostingsService } from './hostings.service';
import { HostingsController } from './hostings.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HostingsController],
  providers: [HostingsService],
  exports: [HostingsService],
})
export class HostingsModule {}
