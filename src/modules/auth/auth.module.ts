import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import AuthController from 'src/modules/auth/auth.controller';
import AuthService from 'src/modules/auth/auth.service';
import {
  PassResetRequest,
  PassResetRequestSchema,
} from 'src/modules/auth/schema/pass-reset.schema';
import PassResetRequestService from 'src/modules/auth/pass-reset.service';
import LocalStrategy from 'src/modules/auth/strategies/local.strategy';
import UserModule from 'src/modules/user/user.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    MongooseModule.forFeature([
      { name: PassResetRequest.name, schema: PassResetRequestSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, PassResetRequestService, LocalStrategy],
})
export default class AuthModule {}
