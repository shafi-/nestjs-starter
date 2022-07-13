import * as bcrypt from 'bcrypt';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import UserService from 'src/modules/user/user.service';
import AuthUser from 'src/modules/auth/domain/auth.user.dto';
import { UserRegistrationDto } from 'src/modules/auth/domain/user.registration.dto';
import { UserDocument } from 'src/modules/user/user.schema';
import { randomUUID } from 'crypto';
import PassResetRequestService from 'src/modules/auth/pass-reset.service';
import passResetDto from 'src/modules/auth/domain/pass-reset.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly prRequestService: PassResetRequestService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<AuthUser> {
    const user = await this.userService.findByEmailOrPhone(username);

    if (!user || !bcrypt.compareSync(pass, user.password)) {
      return null;
    }

    return user;
  }

  validateJwtPayload(payload: AuthUser): Promise<UserDocument> {
    return this.userService.findById(payload.id);
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

    return this.getSanitizedUserWithJwt(user);
  }

  async sendChallenge(username: string): Promise<boolean> {
    const user = await this.userService.findByEmailOrPhone(username);

    if (!user) {
      throw new NotFoundException(null, 'User not found');
    }

    const token = randomUUID({}).substring(0, 6);

    await this.prRequestService.save(user.id, token);

    await this.prRequestService.sendToken(user, token);

    return true;
  }

  async resetPassword(resetReq: passResetDto): Promise<boolean> {
    const user = await this.userService.findByEmailOrPhone(resetReq.username);

    const resetRequest = await this.prRequestService.findLatestByUser(user.id);

    if (!resetRequest) throw new NotFoundException();

    if (resetReq.token === resetRequest.token) {
      await this.userService.resetPassword(user, resetReq.newPass);
    }

    return true;
  }

  async getSanitizedUserWithJwt(user: UserDocument): Promise<AuthUser> {
    const jwt = await this.generateJWT(user);

    return this.sanitizeUser(user, jwt);
  }

  private async generateJWT(user: UserDocument): Promise<string> {
    return this.jwtService.signAsync(AuthUser.of(user), {
      expiresIn: this.configService.getOrThrow('JWT_VALIDITY_IN_SECOND'),
      secret: this.configService.getOrThrow('JWT_SECRET'),
    });
  }

  sanitizeUser(user: UserDocument, jwt: string): AuthUser {
    const userInfo = AuthUser.of(user);
    userInfo.jwt = jwt;

    return userInfo;
  }
}
