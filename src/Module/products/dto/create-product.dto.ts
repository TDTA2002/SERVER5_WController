import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Allow, IsArray, ValidateNested } from "class-validator";
import { CreateProductOptionDto } from "src/Module/productOptions/dto/productOptions.dto";

export class CreateProductDto {
  price(price: any): any {
    throw new Error('Method not implemented.');
  }
  @ApiProperty()
  @Allow()
  name: string

  @ApiProperty()
  @Allow()
  des: string

  @ApiProperty()
  @Allow()
  avatar!: string

  @ApiProperty()
  @Allow()
  categoryId: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => CreateProductOptionDto)
  product_options: CreateProductOptionDto[];
}
