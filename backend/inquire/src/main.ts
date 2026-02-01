import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { getCorsConfig } from './config/cors.config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Banking platform API')
    .setDescription('API documentation for Banking platform application')
    .setVersion('1.0.0')
    .addTag('auth')
    .addTag('accounts')
    .addTag('transactions')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(cookieParser());

  const configService = app.get(ConfigService);
  const corsConfig = getCorsConfig(configService);
  app.enableCors(corsConfig);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
