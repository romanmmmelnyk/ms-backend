import { PartialType } from '@nestjs/swagger';
import { CreatePortCategoryDto } from './create-port-category.dto';

export class UpdatePortCategoryDto extends PartialType(CreatePortCategoryDto) {}
