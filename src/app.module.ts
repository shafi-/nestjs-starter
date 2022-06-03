import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import DbModule from 'src/modules/db/db.module';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule,
    Logger,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
