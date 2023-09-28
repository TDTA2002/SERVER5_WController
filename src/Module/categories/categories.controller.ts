import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, HttpException, Query, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Response } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { uploadFileToStorage } from 'src/firebase';
// import { title } from 'process';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }


  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  async create(
    @Body() body: any, createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {

    console.log("file", file);

    let data = JSON.parse(body.title)
    console.log("file", data);

    let url = await uploadFileToStorage(file, "categoryAvatar", file.buffer)
    console.log("url", url);
    const newData = {
      ...data,
      avatar: url
    }
    console.log("newData", newData);

    try {
      let serviceRes = await this.categoriesService.create(newData);
      res.charset = 'utf-8';
      return res
        .status(res.status ? 200 : 213)
        .json({ message: serviceRes.message, data: serviceRes.data });
    } catch (err) {
      console.log("err", err);
      return res.status(500).json({
        message: 'Server Controller Error!',
      })
    }
  }


  @Get()
  async findAll(@Res() res: Response, @Query('q') q: string) {
    try {
      if (q != undefined) {
        let serviceRes = await this.categoriesService.searchByTilte(q);
        res.statusMessage = serviceRes.message;
        return res.status(HttpStatus.OK).json(serviceRes)
      }


      let serviceRes = await this.categoriesService.findAll()
      res.statusMessage = serviceRes.message;
      return res.status(HttpStatus.OK).json(serviceRes)
    } catch {
      throw new HttpException("Lỗi Controller", HttpStatus.BAD_REQUEST)
    }
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    try {
      let serviceRes = await this.categoriesService.findByid(id)
      res.statusMessage = serviceRes.message;
      return res.status(HttpStatus.OK).json(serviceRes)
    } catch {
      throw new HttpException("Lỗi Controller", HttpStatus.BAD_REQUEST)
    }
  }

  @Patch(':id')
  async update(@Res() res: Response, @Param('id') id: string, @Body() createCategoryDto: CreateCategoryDto) {
    try {
      let serviceRes = await this.categoriesService.update(id, createCategoryDto)
      res.statusMessage = serviceRes.message;
      return res.status(HttpStatus.OK).json(serviceRes)
    } catch {
      throw new HttpException("Lỗi Controller", HttpStatus.BAD_REQUEST)
    }
  }

  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: string) {
    try {
      let serviceRes = await this.categoriesService.remove(id)
      res.statusMessage = serviceRes.message;
      return res.status(HttpStatus.OK).json(serviceRes)
    } catch {
      throw new HttpException("Lỗi Controller", HttpStatus.BAD_REQUEST)
    }
  }
}
