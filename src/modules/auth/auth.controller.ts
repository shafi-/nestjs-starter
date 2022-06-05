import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Request as IRequest } from 'express';
import AuthService from 'src/modules/auth/auth.service';
import AuthUser from 'src/modules/auth/domain/auth.user';
import PassResetDto from 'src/modules/auth/domain/pass-reset.dto';
import { UserRegistrationDto } from 'src/modules/auth/domain/user.registration.dto';
import JwtGuard from 'src/modules/auth/guards/jwt.guard';
import LocalGuard from 'src/modules/auth/guards/local.guard';

@Controller('/auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UseGuards(LocalGuard)
  login(@Request() req: IRequest): Promise<AuthUser> {
    return this.authService.getSanitizedUserWithJwt(req.user);
  }

  @Post('/register')
  register(@Body() userInfo: UserRegistrationDto): Promise<AuthUser> {
    return this.authService.register(userInfo);
  }

  @Post('/forget-password')
  sendChallenge(@Body('username') username: string): void {
    this.authService.sendChallenge(username);
  }

  @Post('/reset-password')
  resetPassword(
    @Body('reset_request') resetReq: PassResetDto,
  ): Promise<boolean> {
    return this.authService.resetPassword(resetReq);
  }

  @Get('/me')
  @UseGuards(JwtGuard)
  me(@Request() req: IRequest): AuthUser {
    return req.user;
  }
}
