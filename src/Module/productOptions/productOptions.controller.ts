import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateProductOptionDto } from './dto/productOptions.dto';
import { ProductOptionsService } from './productOptions.service';

@Controller('product-options')
export class ProductOptionsController {
    constructor(private readonly productOptionsService: ProductOptionsService) { }

    @Post()
    async create(@Body() createProductOptionDto: CreateProductOptionDto, @Res() res: Response) {
        try {
            let [status, message, data] = await this.productOptionsService.create(createProductOptionDto);
            return res.status(status ? 200 : 213).json({
                message,
                data
            })
        } catch (err) {
            return res.status(500).json({
                message: "Controller lỗi!"
            })
        }
    }
}
