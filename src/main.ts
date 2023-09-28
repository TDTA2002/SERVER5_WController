import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CategoriesModule } from './Module/categories/categories.module';
import { ProductsModule } from './Module/products/products.module';
import { UserModule } from './Module/user/user.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  /* Version API */
  app.setGlobalPrefix('api')
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ["1"],
  });

  /* Validate */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );


  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);


  const secondOptions = new DocumentBuilder()
    .setTitle('category example')
    .setDescription('The category API description')
    .setVersion('1.0')
    .addTag('category')
    .build();

  const dogDocument = SwaggerModule.createDocument(app, secondOptions, {
    include: [CategoriesModule],
  });
  SwaggerModule.setup('category', app, dogDocument);



  const sOptions = new DocumentBuilder()
    .setTitle('user example')
    .setDescription('The user API description')
    .setVersion('1.0')
    .addTag('user')
    .build();

  const userDocument = SwaggerModule.createDocument(app, sOptions, {
    include: [UserModule],
  });
  SwaggerModule.setup('user', app, userDocument);

  const Options = new DocumentBuilder()
    .setTitle('product example')
    .setDescription('The product API description')
    .setVersion('1.0')
    .addTag('products')
    .build();
  const productDocument = SwaggerModule.createDocument(app, Options, {
    include: [ProductsModule],
  });
  SwaggerModule.setup('product', app, productDocument);

  await app.listen(process.env.PORT);
  console.log("Listen to http://localhost:" + process.env.PORT);

}
bootstrap();
