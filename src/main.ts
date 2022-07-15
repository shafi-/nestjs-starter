import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import Constants from 'src/constants';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import SwaggerService from 'src/modules/swagger/SwaggerService';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('NestApplication');
  const configService = await app.resolve<ConfigService>(ConfigService);

  const APP_PORT = configService.get(Constants.Env.APP_PORT);

  new SwaggerService(configService, logger).setup(app);

  const payloadLimitSize = '1mb';

  app.use(bodyParser.json({ limit: payloadLimitSize || '1mb' }));

  app.use(
    bodyParser.urlencoded({
      limit: payloadLimitSize || '1mb',
      parameterLimit: 10000000,
      extended: true,
    }),
  );

  await app.listen(APP_PORT);

  logger.log(`Nest Application is running at http://localhost:${APP_PORT}`);
}

bootstrap();
