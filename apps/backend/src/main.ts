import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import express from "express";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as functions from "firebase-functions";
import { initFirebase } from "./utils/firebase";

const server = express();

const createNestServer = async (expressInstance: express.Express) => {
  await initFirebase();

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance)
  );

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: "http://localhost:5173",
  });

  return app.init();
};

console.log("environment:", process.env.NODE_ENV);
createNestServer(server)
  .then(() => console.log("Nest Ready"))
  .catch((err) => console.error("Nest broken", err));

export const api = functions.region("asia-northeast1").https.onRequest(server);
