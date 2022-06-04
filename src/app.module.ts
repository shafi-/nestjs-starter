import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import DbModule from 'src/modules/db/db.module';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import UserModule from 'src/modules/user/user.module';
import AuthModule from 'src/modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
