import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOption } from './entities/productOptions.entity';
import { ProductOptionsController } from './productOptions.controller';
import { ProductOptionsService } from './productOptions.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProductOption])
    ],
    controllers: [ProductOptionsController],
    providers: [ProductOptionsService],
})
export class ProductOptionsModule { }
