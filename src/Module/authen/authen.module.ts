import { Module } from '@nestjs/common';
import { AuthenService } from './authen.service';
import { AuthenController } from './authen.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { JwtService } from 'src/utils/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AuthenController],
  providers: [AuthenService, UserService, JwtService],
})
export class AuthenModule { }
