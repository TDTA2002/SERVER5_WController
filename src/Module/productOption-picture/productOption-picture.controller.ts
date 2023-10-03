import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseInterceptors, UploadedFiles } from '@nestjs/common';

import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { uploadFileToStorage } from '../../firebase'
import { OptionPicturesService } from './productOption-picture.service';

@Controller('option-pictures')
export class OptionPicturesController {
    constructor(private readonly optionPicturesService: OptionPicturesService) { }

    @Post(":optionId")
    @UseInterceptors(FilesInterceptor('pictures'))
    async create(@UploadedFiles() files: Array<Express.Multer.File>, @Param('optionId') optionId: string, @Res() res: Response) {
        try {

            let pictures: {
                icon: string,
                optionId: string
            }[] = []
            for (let file of files) {
                let url = await uploadFileToStorage(file, "products", file.buffer)
                pictures.push({
                    optionId,
                    icon: url ? url : "xxx.jpg"
                })
            }
            let [status, message, data] = await this.optionPicturesService.create(pictures);
            return res.status(status ? 200 : 213).json({
                message,
                data
            })
        } catch (err) {
            return res.status(500).json({
                message: "Controller error"
            })
        }
    }

    @Patch(":optionId") // Sử dụng phương thức PUT để thực hiện cập nhật
    @UseInterceptors(FilesInterceptor('pictures'))
    async update(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Param('optionId') optionId: string,
        @Res() res: Response,
    ) {
        console.log("files", files);

        try {
            let pictures: {
                icon: string,
                optionId: string
            }[] = [];

            await this.optionPicturesService.deleteByOptionId(optionId);

            for (let file of files) {
                let url = await uploadFileToStorage(file, "products", file.buffer);
                pictures.push({
                    optionId,
                    icon: url ? url : "xxx.jpg",
                });
            }

            let [status, message, data] = await this.optionPicturesService.create(pictures);

            return res.status(status ? 200 : 213).json({
                message,
                data,
            });
        } catch (err) {
            return res.status(500).json({
                message: "Controller error",
            });
        }
    }

}
