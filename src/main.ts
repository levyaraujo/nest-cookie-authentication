import { NestFactory } from '@nestjs/core';
import { UserModule } from './user/user.module';
import cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
