import { Module } from '@nestjs/common';
import { PortCategoriesService } from './port-categories.service';
import { PortCategoriesController } from './port-categories.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PortCategoriesController],
  providers: [PortCategoriesService],
  exports: [PortCategoriesService],
})
export class PortCategoriesModule {}
