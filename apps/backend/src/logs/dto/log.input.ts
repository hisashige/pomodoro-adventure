import { Int, Field, InputType, ID } from "@nestjs/graphql";
import { MaxLength } from "class-validator";

@InputType()
export class LogInput {
  @Field((type) => Int)
  id: number;

  @Field((type) => Int)
  questId: number;

  @Field()
  @MaxLength(30)
  enemy: string;

  @Field((type) => Int)
  minutes: number;

  @Field()
  done: boolean;

  @Field()
  startTime: string;
}
