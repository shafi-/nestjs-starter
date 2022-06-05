import { Module, OnModuleInit } from '@nestjs/common';
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
import { JwtModule } from '@nestjs/jwt';
import JwtStrategy from 'src/modules/auth/strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    PassportModule,
    MongooseModule.forFeature([
      { name: PassResetRequest.name, schema: PassResetRequestSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow('JWT_VALIDITY_IN_SECOND'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PassResetRequestService, LocalStrategy, JwtStrategy],
})
export default class AuthModule implements OnModuleInit {
  onModuleInit() {
    console.log('ModuleInit: [Auth]');
  }
}
