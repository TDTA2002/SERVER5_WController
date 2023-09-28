import { Allow, IsEmail } from "class-validator";

export class LoginDto {
    @Allow()
    userNameOrEmail: string;

    @Allow()
    password: string;
}