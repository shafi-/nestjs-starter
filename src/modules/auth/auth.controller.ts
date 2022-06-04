import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import AuthService from 'src/modules/auth/auth.service';
import AuthUser from 'src/modules/auth/auth.user';
import LocalGuard from 'src/modules/auth/guards/local.guard';

@Controller('/auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UseGuards(LocalGuard)
  login(@Request() req): AuthUser {
    return req.user;
  }
}
