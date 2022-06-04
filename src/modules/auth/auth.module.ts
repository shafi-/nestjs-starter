import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import AuthController from 'src/modules/auth/auth.controller';
import AuthService from 'src/modules/auth/auth.service';
import LocalStrategy from 'src/modules/auth/strategies/local.strategy';
import UserModule from 'src/modules/user/user.module';

@Module({
  imports: [UserModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export default class AuthModule {}
