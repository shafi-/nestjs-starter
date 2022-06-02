import { Injectable } from '@nestjs/common';
import AuthUser from 'src/auth/domain/AuthUser';
import LoginRequest from 'src/auth/domain/LoginRequest';
import RegistrationRequest from 'src/auth/domain/RegistrationRequest';
import AuthUserProvider from 'src/auth/domain/UserProvider';

@Injectable()
export class AuthService {
  userService: AuthUserProvider<AuthUser>;

  constructor(private jwtService: JwtService) {
    this.userService = new AuthUserProvider();
  }

  async register(registrationRequest: RegistrationRequest): Promise<string> {
    const user = await this.userService.register(registrationRequest);
    return this.login(user as unknown as LoginRequest);
  }

  login(loginRequest: LoginRequest): string {
    return this.jwtService.login(loginRequest);
  }
}
