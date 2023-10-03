import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OptionPicture } from './entities/productOption-picture.entity';

@Injectable()
export class OptionPicturesService {

    constructor(@InjectRepository(OptionPicture) private readonly optionPictures: Repository<OptionPicture>) { }

    async create(pictures: {
        icon: string,
        optionId: string
    }[]) {
        try {
            for (let picture of pictures) {
                await this.optionPictures.save(picture);
            }
            let pictureList = await this.optionPictures.find({
                where: {
                    optionId: pictures[0].optionId
                }
            })
            if (!pictureList) return [false, "Lỗi", null]
            return [true, "ok", pictureList]
        } catch (err) {
            return [false, "Model error", null]
        }
    }


    async update(pictures: {
        icon: string,
        optionId: string
    }[]) {
        try {
            // Xóa tất cả các hình ảnh có cùng optionId
            await this.optionPictures.delete({ optionId: pictures[0].optionId });

            // Thêm các hình ảnh mới
            for (let picture of pictures) {
                await this.optionPictures.save(picture);
            }

            // Lấy danh sách hình ảnh đã cập nhật
            let pictureList = await this.optionPictures.find({
                where: {
                    optionId: pictures[0].optionId
                }
            });

            if (!pictureList) {
                return [false, "Lỗi", null];
            }

            return [true, "Cập nhật thành công", pictureList];
        } catch (err) {
            console.log("err", err);

            return [false, "Lỗi trong quá trình cập nhật", null];
        }
    }
    async deleteByOptionId(optionId: string): Promise<void> {
        await this.optionPictures.delete({ optionId });
    }

}
