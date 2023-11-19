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
    origin: (origin, callback) => {
      const allowedOrigins = ["https://pomodoro-adventure.vercel.app"];
      const pattern =
        /^https:\/\/pomodoro-adventure-(.+)-hisashige\.vercel\.app$/;

      if (!origin) {
        callback(null, true);
      } else if (allowedOrigins.includes(origin) || pattern.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  });

  return app.init();
};

console.log("environment:", process.env.NODE_ENV);
createNestServer(server)
  .then(() => console.log("Nest Ready"))
  .catch((err) => console.error("Nest broken", err));

export const api = functions.region("asia-northeast1").https.onRequest(server);
