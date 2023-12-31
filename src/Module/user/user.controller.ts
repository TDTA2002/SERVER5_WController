import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Req, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response, Request } from 'express';
import { MailService, templates } from '../mail/mail.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as  bcrypt from 'bcrypt'
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LoginDto } from './dto/login.dto';
import common from 'src/utils/common';
import { JwtService } from '../jwt/jwt.service';
import { GoogleLoginDto } from './dto/googleLogion.dto';
import axios from 'axios';
import jwt from 'src/utils/jwt';


@Controller('user')

export class UserController {
  constructor(private readonly usersService: UserService, private readonly mail: MailService, private readonly jwt: JwtService) { }

  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() req: Request, @Res() res: Response) {
    try {
      let userDecode = this.jwt.verifyToken(String(req.headers.token));

      if (userDecode) {
        let serResUser = await this.usersService.findById(userDecode.id);
        if (serResUser.data.updateAt == userDecode.updateAt) {
          if (serResUser.status) {
            if (await bcrypt.compare(changePasswordDto.oldPassword, userDecode.password)) {
              await this.mail.sendMail({
                subject: "Thay đổi mật khẩu",
                to: userDecode.email,
                html: `
                  <h2>Mật khẩu của bạn sẽ bị thay đổi nếu bấm vào link bên dưới</h2>
                  <a href='${process.env.HOST}:${process.env.PORT}/api/v1/user/authentication-change-password/${this.jwt.createToken(
                  {
                    ...(serResUser.data),
                    newPassword: changePasswordDto.newPassword
                  },
                  "300000"
                )}'>Xác Nhận</a>
                `
              })

              return res.status(200).json({
                message: "Kiểm tra email để xác nhận đổi mật khẩu!"
              })
            } else {
              return res.status(213).json({
                message: "Mật khẩu không chính xác!"
              })
            }
          }
        }
      }

      return res.status(213).json({
        message: "Xác thực thất bại!"
      })
    } catch (err) {
      return res.status(500).json({
        message: "Server Controller Error!"
      });
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Res() res: Response) {
    try {

      let serResUser = await this.usersService.findByEmailOrUserName(resetPasswordDto.email);
      if (serResUser) {
        await this.mail.sendMail({
          subject: "Khôi phục mật khẩu",
          to: resetPasswordDto.email,
          html: `
              <h2>Xác nhận email để nhận mật khẩu khôi phục</h2>
              <a href='${process.env.HOST}:${process.env.PORT}/api/v1/user/authentication-reset-password/${this.jwt.createToken(
            serResUser.data,
            "300000"
          )}'>Xác Nhận</a>
            `
        })
        return res.status(200).json({
          message: "Check email!"
        });
      }
    } catch (err) {
      return res.status(500).json({
        message: "Server Controller Error!"
      });
    }
  }

  @Get('authentication-reset-password/:token')
  async authenticationResetPassword(@Param('token') token: string, @Res() res: Response) {
    try {
      let userDecode = this.jwt.verifyToken(String(token));
      if (userDecode) {
        let serResUser = await this.usersService.findById(userDecode.id);
        if (serResUser.data.updateAt == userDecode.updateAt) {
          if (serResUser.status) {
            if (serResUser.data.updateAt == userDecode.updateAt) {
              let randomPassword = common.generateOTP();
              let serUpdateUser = await this.usersService.update(userDecode.id, {
                password: await bcrypt.hash(randomPassword, 10)
              })
              if (serUpdateUser.status) {
                await this.mail.sendMail({
                  subject: "Khôi phục mật khẩu",
                  to: userDecode.email,
                  html: `
                    <h2>Mật khẩu của bạn là</h2>
                    <span>${randomPassword}</span>
                  `
                })
                return res.status(200).send("Check your mail!")
              }
            }
          }
        }
      }

      return res.status(213).json({
        message: "Xác thực thất bại!"
      })
    } catch (err) {
      return res.status(500).json({
        message: "Server Controller Error!"
      });
    }
  }

  @Get('authentication-change-password/:token')
  async authenticationChangePassword(@Param('token') token: string, @Res() res: Response) {
    try {
      let userDecode = this.jwt.verifyToken(String(token));
      if (userDecode) {
        let serResUser = await this.usersService.findById(userDecode.id);
        if (serResUser.data.updateAt == userDecode.updateAt) {
          if (serResUser.status) {
            if (serResUser.data.updateAt == userDecode.updateAt) {
              let serUpdateUser = await this.usersService.update(userDecode.id, {
                password: await bcrypt.hash(userDecode.newPassword, 10)
              })
              if (serUpdateUser.status) {
                return res.status(200).send("Change Password Ok!")
              }
            }
          }
        }
      }

      return res.status(213).json({
        message: "Xác thực thất bại!"
      })
    } catch (err) {
      return res.status(500).json({
        message: "Server Controller Error!"
      });
    }
  }

  @Get('email-authentication/:userId/:token')
  async emailAuthentication(@Param('userId') userId: string, @Param('token') token: string, @Res() res: Response) {
    try {
      let userDecode = this.jwt.verifyToken(token);
      let serResUser = await this.usersService.findById(userId);
      if (serResUser.status && userDecode) {
        if (serResUser.data.updateAt == userDecode.updateAt) {
          if (!serResUser.data.emailAuthentication) {
            let serRes = await this.usersService.update(userId, {
              emailAuthentication: true
            });
            console.log("serRes", serRes)
            if (serRes.status) {
              /* Mail */
              this.mail.sendMail({
                subject: "Authentication Email Notice",
                to: serRes.data.email,
                text: `Email đã được liên kết với tài khoản ${serRes.data.userName}`
              })
            }

            return res.status(serRes.status ? 200 : 213).send(serRes.status ? "ok" : "fail");
          } else {
            return res.status(213).send("Tài khoản đã kích hoạt email!");
          }
        }
      }
      return res.status(213).send("Email đã hết hạn!");
    } catch (err) {
      return res.status(500).json({
        message: "Server Controller Error!"
      });
    }
  }

  @Get('resend-email')
  async resendEmail(@Req() req: Request, @Res() res: Response) {
    try {
      let userDecode = this.jwt.verifyToken(String(req.headers.token));
      let serResUser = await this.usersService.findById(userDecode.id);
      if (serResUser.status && userDecode) {
        if (serResUser.data.updateAt == userDecode.updateAt) {
          if (!serResUser.data.emailAuthentication) {
            /* Mail */
            let check = await this.mail.sendMail({
              subject: "Authentication Email",
              to: serResUser.data.email,
              html: templates.emailConfirm({
                confirmLink: `${process.env.HOST}:${process.env.PORT}/api/v1/users/email-authentication/${serResUser.data.id}/${this.jwt.createToken(serResUser.data, "300000")}`,
                language: "vi",
                productName: "Miêu Shop",
                productWebUrl: "mieushop.com",
                receiverName: `${serResUser.data.firstName} ${serResUser.data.lastName}`
              })
            })
            console.log("check", check)
            return res.status(200).send("Check email");
          } else {
            return res.status(213).send("Tài khoản đã kích hoạt email!");
          }
        }
      }
      return res.status(213).send("Xác thực thất bại");
    } catch (err) {
      return res.status(500).json({
        message: "Server Controller Error!"
      });
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      let serRes = await this.usersService.findByEmailOrUserName(loginDto.userNameOrEmail);

      if (!serRes.status) {
        return res.status(213).json({
          message: "Không tìm thấy tài khoản"
        });
      }

      if (serRes.data.status != "ACTIVE") {
        return res.status(213).json({
          message: `Tài khoản bị ${serRes.data.status}`
        });
      }

      if (!(await bcrypt.compare(loginDto.password, serRes.data.password))) {
        return res.status(213).json({
          message: "Mật khẩu không chính xác"
        });
      }

      /* Mail */
      this.mail.sendMail({
        subject: "Register Authentication Email",
        to: serRes.data.email,
        text: `Tài khoản của bạn vừa được login ở một thiết bị mới`
      })

      return res.status(200).json({
        token: this.jwt.createToken(serRes.data, '1d')
      });
      // return res.status(serRes.status ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(serRes);
    } catch (err) {
      return res.status(500).json({
        message: "Server Controller Error!"
      });
    }
  }

  @Post('google-login')
  async googleLogin(@Body() googleLoginDto: GoogleLoginDto, @Req() req: Request, @Res() res: Response) {
    try {
      await axios.post("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyD-uPQlOI3t-iF6wGyHYr4ML1KNRmEryB0", {
        idToken: googleLoginDto.accessToken
      })
      let userExist = await this.usersService.findByUserName(googleLoginDto.email);
      if (userExist.status) {
        // đã có tài khoản liên kết gmail này
        let token = jwt.createToken(userExist.data, "1d");
        return res.status(200).json({
          token
        })
      } else {
        /* Đăng ký */
        let newUserRes = await this.usersService.register({
          email: googleLoginDto.email,
          userName: googleLoginDto.userName,
          password: googleLoginDto.password,
          firstName: googleLoginDto.email,
          lastName: ''
        })

        if (newUserRes.status) {
          let token = jwt.createToken(newUserRes.data, "1d");
          return res.status(200).json({
            token
          })
        }

        return res.status(213).json({
          message: "Đăng nhập với google thất bại!"
        })
      }
    } catch {
      return res.status(500).json({
        message: "Lỗi controller"
      })
    }
  }
  // @Post('login')
  // async login(@Body() loginUserDto: LoginDto, @Req() req: Request, @Res() res: Response) {
  //   try {
  //     let serviceRes = await this.usersService.login(loginUserDto);
  //     // serviceRes.message = (Text(String(req.headers.language)) as any)[serviceRes.message];
  //     return res.status(serviceRes.status ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(serviceRes);
  //   } catch {
  //     throw new HttpException('ControllerErr', HttpStatus.BAD_REQUEST);
  //   }
  // }

  @Post()
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      let serRes = await this.usersService.register(createUserDto);

      if (serRes.status) {
        /* Mail */
        this.mail.sendMail({
          subject: "Register Authentication Email",
          to: serRes.data.email,
          html: templates.emailConfirm({
            confirmLink: `${process.env.HOST}:${process.env.PORT}/api/v1/user/email-authentication/${serRes.data.id}/${this.jwt.createToken(serRes.data, "300000")}`,
            language: "vi",
            productName: "PS5",
            productWebUrl: "PS5.com",
            receiverName: `${serRes.data.firstName} ${serRes.data.lastName}`
          })
        })
        ///console.log("check", check, serRes.data.email)
      }

      return res.status(serRes.status ? 200 : 213).json(serRes);
    } catch (err) {
      return res.status(500).json({
        message: "Server Controller Error!"
      });
    }
  }

}
