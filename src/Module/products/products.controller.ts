import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseInterceptors, UploadedFile, UploadedFiles, Query, HttpException, ParseIntPipe, Version } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Response } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { uploadFileToStorage } from 'src/firebase';
import { PaginationDto } from './dto/pagination.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }


  // @Post()
  // @UseInterceptors(FilesInterceptor('product'))

  // async create(@Body() body: any, createProductDto: CreateProductDto, @Res() res: Response) {
  //   try {
  //     console.log("body", body);

  //     let [status, message, data] = await this.productsService.create(createProductDto);
  //     return res.status(status ? 200 : 213).json({
  //       message,
  //       data
  //     })
  //   } catch (err) {
  //     return res.status(500).json({
  //       message: "Controller error!"
  //     })
  //   }
  // }

  @Post()
  @UseInterceptors(FilesInterceptor('product'))

  async create(@Body() createProductDto: any, @Res() res: Response) {
    try {

      let product = JSON.parse(createProductDto.product)

      let [status, message, data] = await this.productsService.create(product);
      return res.status(status ? 200 : 213).json({
        message,
        data
      })
    } catch (err) {
      return res.status(500).json({
        message: "Controller error!"
      })
    }
  }
  @Version('2')
  @Get()
  async findAll(@Res() res: Response, @Query("skip") skip: number, @Query("take") take: number) {
    try {
      if (skip != undefined && take != undefined) {
        let pagination: PaginationDto = {
          skip,
          take
        }
        let serviceRes = await this.productsService.findAll(pagination)
        return res.status(200).json(serviceRes);
      } else {
        let [status, message, data] = await this.productsService.find();
        return res.status(status ? 200 : 213).json({
          message,
          data
        })
      }

    } catch (err) {
      console.log("err", err);

      throw new HttpException('Lỗi xử lý', HttpStatus.BAD_REQUEST)
    }
  }

  @Get()
  async find(@Res() res: Response) {
    try {
      let [status, message, data] = await this.productsService.find();
      return res.status(status ? 200 : 213).json({
        message,
        data
      })
    } catch (err) {
      return res.status(500).json({
        message: "Controller error!"
      })
    }
  }


  @Get('category/:id')
  async findByCategory(@Res() res: Response, @Param('id') categoryId: string) {
    try {
      let serviceRes = await this.productsService.findByCategory(categoryId)
      return res.status(HttpStatus.OK).json(serviceRes)
    } catch {
      throw new HttpException("Lỗi Controller", HttpStatus.BAD_REQUEST)
    }
  }

  @Get(':id')
  async findByid(@Res() res: Response, @Param('id') id: string) {
    try {
      let serviceRes = await this.productsService.findOne(id)
      return res.status(HttpStatus.OK).json(serviceRes)
    } catch {
      throw new HttpException("Lỗi Controller", HttpStatus.BAD_REQUEST)
    }
  }


}
