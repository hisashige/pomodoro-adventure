import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { Log } from "./models/log.model";
import { LogsService } from "./logs.service";
import { LogInput } from "./dto/log.input";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/common/guards/auth.guard";
import { RequestContext } from "src/types/context";

const pubSub = new PubSub();

@Resolver(() => Log)
export class LogsResolver {
  constructor(private readonly logsService: LogsService) {}

  @Query((returns) => [Log])
  @UseGuards(AuthGuard)
  logs(@Context() context: RequestContext): Promise<Log[]> {
    const user = context.req.user;
    return this.logsService.findListByUid(user.uid);
  }

  @Mutation((returns) => Log)
  @UseGuards(AuthGuard)
  async createLog(
    @Context() context: RequestContext,
    @Args("logData", { type: () => LogInput })
    logInput: LogInput
  ): Promise<Log> {
    const user = context.req.user;
    const log = await this.logsService.createLog(user.uid, logInput);
    pubSub.publish("logUpdated", { logAdded: log });
    return log;
  }

  @Mutation((returns) => Log)
  @UseGuards(AuthGuard)
  async updateLog(
    @Context() context: RequestContext,
    @Args("logData", { type: () => LogInput })
    logInput: LogInput
  ): Promise<Log> {
    const user = context.req.user;
    const log = await this.logsService.updateLog(user.uid, logInput);
    pubSub.publish("logUpdated", { logAdded: log });
    return log;
  }

  @Subscription((returns) => [Log])
  logUpdated() {
    return pubSub.asyncIterator("questUpdated");
  }
}
