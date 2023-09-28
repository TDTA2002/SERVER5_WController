import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AuthenService } from './authen.service';
import { CreateAuthenDto } from './dto/create-authen.dto';
import { UpdateAuthenDto } from './dto/update-authen.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import * as  bcrypt from 'bcrypt'
import { AuthenticationDto } from './dto/authentication.dto';
import { UserService } from '../user/user.service';
import { JwtService } from 'src/utils/jwt';
// import jwt from 'src/utils/jwt';


@Controller('authen')
export class AuthenController {
  constructor(private readonly authenService: AuthenService, private readonly userService: UserService, private readonly jwt: JwtService) { }

  @Post()
  async memberAuthentication(@Body() authenticationDto: AuthenticationDto, @Res() res: Response) {
    try {
      let userDecode = this.jwt.verifyToken(authenticationDto.token);
      if (userDecode) {
        let serResUser = await this.userService.findById(userDecode.id);
        if (serResUser.status) {
          if (userDecode.updateAt == serResUser.data.updateAt) {
            return res.status(200).json(serResUser);
          }
        }
      }
      return res.status(213).json({
        message: "Authen failed!"
      })
    } catch {
      return res.status(500).json({
        message: "Lỗi controller"
      })
    }
  }

}
