import { ApiProperty } from "@nestjs/swagger";
import { Allow } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty()
    @Allow()
    title: string

    @ApiProperty()
    @Allow()
    avatar: string
}
