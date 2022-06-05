import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import Constants from 'src/constants';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('NestApplication');
  const configService = await app.resolve<ConfigService>(ConfigService);

  const APP_PORT = configService.get(Constants.Env.APP_PORT);
  const isSwaggerEnabled = configService.get<boolean>('SWAGGER_ENABLE', false);

  if (isSwaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle(configService.get('SWAGGER_TITLE', 'API docs'))
      .setDescription(configService.get('SWAGGER_DESC', 'The API description'))
      .setVersion(configService.get('SWAGGER_VERSION', '1.0'))
      .addTag(configService.get('SWAGGER_TAG', 'nestjs-starter'))
      .build();

    const document = SwaggerModule.createDocument(app, config);
    const swaggerPrefix = configService.getOrThrow('SWAGGER_PREFIX');
    SwaggerModule.setup(swaggerPrefix, app, document);

    logger.log(
      `Swagger doc is running at http://localhost:${APP_PORT}${swaggerPrefix}`,
    );
  }

  await app.listen(APP_PORT);

  logger.log(`Nest Application is running at http://localhost:${APP_PORT}`);
}

bootstrap();
