import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { FindByIdSerRes, UpdateSerRes } from './user.interface';
import validation from 'src/utils/validation';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import jwt from '../../utils/jwt';
import { JwtService } from '../jwt/jwt.service';

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private users: Repository<User>, private jwtService: JwtService) { }

  async register(CreateUserDto: CreateUserDto) {
    try {
      let newUser = this.users.create(CreateUserDto);
      let result = await this.users.save(newUser);

      return {
        status: true,
        message: "Register good!",
        data: result
      }

    } catch (err) {
      console.log("err", err);

      return {
        status: false,
        message: "Lỗi model",
        data: null
      }
    }
  }
  async update(userId: string, updateUserDto: UpdateUserDto): Promise<UpdateSerRes> {
    try {
      let userSource = await this.users.findOne({
        where: {
          id: userId
        }
      })
      let userSourceUpdate = this.users.merge(userSource, updateUserDto);
      let result = await this.users.save(userSourceUpdate);
      return {
        status: true,
        data: result,
        message: "Update ok!"
      }
    } catch (err) {
      return {
        status: false,
        data: null,
        message: "Lỗi model"

      }
    }
  }
  async findById(userId: string): Promise<FindByIdSerRes> {
    try {
      let result = await this.users.findOne({
        where: {
          id: userId
        }
      })
      if (!result) {
        throw new Error
      }
      return {
        status: true,
        data: result,
        message: "findById good!"
      }
    } catch (err) {
      return {
        status: false,
        data: null,
        message: "Lỗi model"
      }
    }
  }

  async findByEmailOrUserName(emailOrUserName: string): Promise<FindByIdSerRes> {
    try {
      let result = await this.users.findOne({
        where: validation.isEmail(emailOrUserName)
          ? {
            email: emailOrUserName,
            emailAuthentication: true
          }
          : {
            userName: emailOrUserName
          }
      });
      if (!result) {
        throw new Error
      }
      return {
        status: true,
        data: result,
        message: "find thành công"
      }
    } catch (err) {
      return { status: false, data: null, message: "lỗi" }
    }
  }
  async login(loginUserDto: LoginDto) {
    try {
      const user = await this.users.findOne({
        where: { userName: loginUserDto.userNameOrEmail }
      })
      if (!user) {
        throw new HttpException("userName is not exist", HttpStatus.UNAUTHORIZED);
      }
      const checkPassword = bcrypt.compareSync(loginUserDto.password, user.password);
      if (!checkPassword) {
        throw new HttpException("Password is not correct", HttpStatus.UNAUTHORIZED);
      }
      return {
        status: true,
        message: "SignInSuccess",
        data: user,
        token: jwt.createToken(user, "1d"),
      }
    } catch (err) {
      return {
        status: false,
        message: err.response,
        data: null
      }
    }

  }
  async findByUserName(userName: string): Promise<FindByIdSerRes> {
    try {
      let result = await this.users.findOne({
        where: {
          userName
        }
      });

      if (!result) {
        throw new Error
      }

      return {
        status: true,
        data: result,
        message: "Find user ok!"
      }
    } catch (err) {
      return {
        status: false,
        data: null,
        message: "Lỗi model"
      }
    }
  }
}