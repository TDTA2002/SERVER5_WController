import { PartialType } from '@nestjs/swagger';
import { Allow } from 'class-validator';
import { CreateProductOptionDto } from './productOptions.dto';

export class UpdateProductOptionDto extends PartialType(CreateProductOptionDto) {
    @Allow()
    title?: string
    @Allow()
    status?: boolean

    @Allow()
    price: number
}