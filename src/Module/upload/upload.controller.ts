import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { uploadFileToStorage } from '../../firebase';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  // @Post()
  // @UseInterceptors(FileInterceptor('avatar'))

  // async create(@Body() body: any, @UploadedFile() imgs: Array<Express.Multer.File>) {
  //   console.log("avatar", imgs);
  //   return
  // }

  @Post()
  @Post('avatar')
  @UseInterceptors(FilesInterceptor('avatar', 20))
  async uploadImages(@UploadedFiles() images: Express.Multer.File[]) {
    // Xử lý tệp tin hình ảnh ở đây
    console.log('images', images);
    // Trả về phản hồi hoặc thực hiện xử lý khác tùy ý
  }

}
