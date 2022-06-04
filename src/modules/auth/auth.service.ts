import * as bcrypt from 'bcrypt';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import UserService from 'src/modules/user/user.service';
import AuthUser from 'src/modules/auth/auth.user';
import { UserRegistrationDto } from 'src/modules/auth/domain/user.registration.dto';
import { UserDocument } from 'src/modules/user/user.schema';

@Injectable()
export default class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(username: string, pass: string): Promise<AuthUser> {
    const user = await this.userService.findUser({
      $or: [
        {
          email: username,
        },
        {
          phone: username,
        },
      ],
    });

    if (!user || !bcrypt.compareSync(pass, user.password)) {
      return null;
    }

    return this.sanitizeUser(user);
  }

  async register(userInfo: UserRegistrationDto): Promise<AuthUser> {
    console.log(`Registering user ${userInfo.fullName}`);

    if (!userInfo.email || !userInfo.phone) {
      throw new UnprocessableEntityException(
        {
          errors: {
            email: ['Is required'],
            phone: ['Is required'],
          },
        },
        'No email or phone number is provided',
      );
    }

    if (!userInfo.password) {
      throw new UnprocessableEntityException(
        {
          errors: {
            password: ['Is required'],
          },
        },
        'Password is required',
      );
    }

    const SALT_ROUND = 10;
    const salt = bcrypt.genSaltSync(SALT_ROUND);
    userInfo.password = bcrypt.hashSync(userInfo.password, salt);

    const user = await this.userService.register(userInfo);

    return this.sanitizeUser(user);
  }

  sanitizeUser(user: UserDocument): AuthUser {
    const userInfo = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
    } as AuthUser;

    userInfo.jwt = JSON.stringify(userInfo);

    return userInfo;
  }
}
