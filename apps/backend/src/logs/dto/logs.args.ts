import { ArgsType, Field } from "@nestjs/graphql";
import { MaxLength, MinLength } from "class-validator";

@ArgsType()
export class LogsArgs {
  @Field()
  @MaxLength(32)
  @MinLength(1)
  uid: string;
}
