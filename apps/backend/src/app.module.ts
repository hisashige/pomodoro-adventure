import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { DirectiveLocation, GraphQLDirective } from "graphql";
import { QuestsModule } from "./quests/quests.module";
import { LogsModule } from "./logs/logs.module";
import { join } from "path";

const isEmulated = process.env.FUNCTIONS_EMULATOR === "true";
const isDevelopment = process.env.NODE_ENV === "development";

@Module({
  imports: [
    QuestsModule,
    LogsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile:
        !isEmulated && isDevelopment
          ? join(process.cwd(), "src/schema.gql")
          : undefined,
      typePaths:
        isEmulated || !isDevelopment
          ? [join(process.cwd(), "src/schema.gql")]
          : undefined,
      installSubscriptionHandlers: true,
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: "upper",
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
    }),
  ],
})
export class AppModule {}
