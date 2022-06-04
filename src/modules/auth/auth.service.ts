import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import UserService from 'src/modules/user/user.service';
import AuthUser from 'src/modules/auth/auth.user';

@Injectable()
export default class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(username: string, pass: string): Promise<AuthUser> {
    const user = await this.userService.findUser({
      email: username,
      phone: username,
    });

    if (!user) {
      return null;
    }

    if (!bcrypt.compareSync(pass, user.password)) {
      return null;
    }

    return user as AuthUser;
  }
}
