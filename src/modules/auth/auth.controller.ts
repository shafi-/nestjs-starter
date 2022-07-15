import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Request as IRequest } from 'express';
import AuthService from 'src/modules/auth/auth.service';
import AuthUser from 'src/modules/auth/domain/auth.user.dto';
import PassResetDto from 'src/modules/auth/domain/pass-reset.dto';
import { UserRegistrationDto } from 'src/modules/auth/domain/user.registration.dto';
import JwtGuard from 'src/modules/auth/guards/jwt.guard';
import LocalGuard from 'src/modules/auth/guards/local.guard';
import ForgetPassDto from 'src/modules/auth/domain/forget-pass.dto';
import LoginPayloadDto from 'src/modules/auth/domain/login-payload.dto';

@ApiTags('Auth')
@Controller('/auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({
    type: LoginPayloadDto,
    examples: {
      loginByPhone: { summary: 'Phone number Login', value: { username: '01234567899', password: 'changeme' } },
      loginByEmail: { summary: 'Email Login', value: { username: 'john.doe@nest.starter', password: 'changeme' } }
    }
  })
  @Post('/login')
  @UseGuards(LocalGuard)
  login(@Request() req: IRequest): Promise<AuthUser> {
    return this.authService.getSanitizedUserWithJwt(req.user);
  }

  @Post('/register')
  register(@Body() userInfo: UserRegistrationDto): Promise<AuthUser> {
    return this.authService.register(userInfo);
  }

  @ApiBody({ type: ForgetPassDto })
  @Post('/forget-password')
  sendChallenge(@Body() forgetPassDto: ForgetPassDto): void {
    this.authService.sendChallenge(forgetPassDto.username);
  }

  @ApiBody({ type: PassResetDto })
  @Post('/reset-password')
  resetPassword(@Body() resetReq: PassResetDto): Promise<boolean> {
    return this.authService.resetPassword(resetReq);
  }

  @ApiBearerAuth()
  @Get('/me')
  @UseGuards(JwtGuard)
  me(@Request() req: IRequest): Promise<AuthUser> {
    return this.authService.getSanitizedUserWithJwt(req.user);
  }
}
