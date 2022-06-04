import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { Request as IRequest } from 'express';
import AuthService from 'src/modules/auth/auth.service';
import AuthUser from 'src/modules/auth/auth.user';
import { UserRegistrationDto } from 'src/modules/auth/domain/user.registration.dto';
import LocalGuard from 'src/modules/auth/guards/local.guard';

@Controller('/auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UseGuards(LocalGuard)
  login(@Request() req: IRequest): AuthUser {
    return req.user as AuthUser;
  }

  @Post('/register')
  register(@Body() userInfo: UserRegistrationDto): Promise<AuthUser> {
    return this.authService.register(userInfo);
  }
}
