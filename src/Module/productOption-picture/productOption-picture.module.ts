import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionPicture } from './entities/productOption-picture.entity';
import { OptionPicturesController } from './productOption-picture.controller';
import { OptionPicturesService } from './productOption-picture.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([OptionPicture])
    ],
    controllers: [OptionPicturesController],
    providers: [OptionPicturesService],
})
export class OptionPicturesModule { }