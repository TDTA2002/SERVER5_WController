import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './Module/products/products.module';
import { CategoriesModule } from './Module/categories/categories.module';
import { UserModule } from './Module/user/user.module';
import { AuthenModule } from './Module/authen/authen.module';
import { UserAddressesModule } from './Module/user-addresses/user-addresses.module';
import { UploadModule } from './Module/upload/upload.module';
import { ProductOptionsModule } from './Module/productOptions/productOption.module';
import { OptionPicturesModule } from './Module/productOption-picture/productOption-picture.module';
import { SocketModule } from './Module/socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MY_SQL_HOST,
      port: Number(process.env.MY_SQL_PORT),
      username: process.env.MY_SQL_USERNAME,
      password: process.env.MY_SQL_PASSWORD,
      database: process.env.MY_SQL_DATABASE,
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
    })
    ,
    CategoriesModule,
    ProductsModule,
    UserModule,
    AuthenModule,
    UserAddressesModule,
    UploadModule,
    ProductOptionsModule,
    OptionPicturesModule,
    SocketModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
