import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import DbModule from 'src/modules/db/db.module';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import UserModule from 'src/modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule,
    Logger,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
