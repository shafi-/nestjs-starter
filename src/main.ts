import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/:lang');
  app.useGlobalInterceptors(LangCodeInterceptor);
  await app.listen(3000);
}
bootstrap();
