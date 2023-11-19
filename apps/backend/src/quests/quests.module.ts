import { Module } from "@nestjs/common";
import { QuestsResolver } from "./quests.resolver";
import { QuestsService } from "./quests.service";

@Module({
  providers: [QuestsResolver, QuestsService],
})
export class QuestsModule {}
