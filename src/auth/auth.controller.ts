import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import AuthUser from 'src/auth/domain/AuthUser';
import LoginRequest from 'src/auth/domain/LoginRequest';
import RegistrationRequest from 'src/auth/domain/RegistrationRequest';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  myProfile(@Request() authUser: AuthUser): AuthUser {
    return authUser;
  }

  @Post('/login')
  login(@Body() loginRequest: LoginRequest): string {
    return this.authService.login(loginRequest);
  }

  @Post('/register')
  register(@Body() registrationRequest: RegistrationRequest): Promise<string> {
    return this.authService.register(registrationRequest);
  }
}
