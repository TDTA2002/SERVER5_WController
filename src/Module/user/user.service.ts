import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { FindByIdSerRes, RegisterSerRes, UpdateSerRes } from './user.interface';
import validation from 'src/utils/validation';

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private users: Repository<User>) { }

  async register(CreateUserDto: CreateUserDto): Promise<RegisterSerRes> {
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

}