import { ApiProperty } from "@nestjs/swagger";
import { Allow, IsEmail } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsEmail()
    email: string;
    @ApiProperty()

    @Allow()
    firstName: string;
    @ApiProperty()

    @Allow()
    lastName: string;
    @ApiProperty()

    @Allow()
    userName: string;
    @ApiProperty()

    @Allow()
    password: string;
}
