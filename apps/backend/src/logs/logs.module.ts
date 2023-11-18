import { Module } from "@nestjs/common";
import { LogsResolver } from "./logs.resolver";
import { LogsService } from "./logs.service";

@Module({
  providers: [LogsResolver, LogsService],
})
export class LogsModule {}
