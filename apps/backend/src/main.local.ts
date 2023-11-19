import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { initFirebase } from "./utils/firebase";

async function bootstrap() {
  await initFirebase();

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: "http://localhost:5173",
  });

  await app.listen(3000);
  console.log("environment:", process.env.NODE_ENV);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
