import { Injectable } from '@nestjs/common';
import { CreateAuthenDto } from './dto/create-authen.dto';
import { UpdateAuthenDto } from './dto/update-authen.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthenService {
  constructor(@InjectRepository(User) private users: Repository<User>) { }

  create(createAuthenDto: CreateAuthenDto) {
    return 'This action adds a new authen';
  }

  

  findAll() {
    return `This action returns all authen`;
  }

  findOne(id: number) {
    return `This action returns a #${id} authen`;
  }

  update(id: number, updateAuthenDto: UpdateAuthenDto) {
    return `This action updates a #${id} authen`;
  }

  remove(id: number) {
    return `This action removes a #${id} authen`;
  }
}
