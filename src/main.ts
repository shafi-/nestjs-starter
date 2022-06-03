import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import Constants from 'src/constants';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = await app.resolve<ConfigService>(ConfigService);

  await app.listen(configService.get(Constants.Env.APP_PORT));

  const logger = await app.resolve<Logger>(Logger);

  logger.log(
    `Nest Application is running at http://localhost:${configService.get(
      Constants.Env.APP_PORT,
    )}`,
  );
}

bootstrap();
