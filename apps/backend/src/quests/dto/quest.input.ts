import { Int, Field, InputType, ID } from "@nestjs/graphql";
import { MaxLength } from "class-validator";

@InputType()
export class QuestInput {
  @Field((type) => Int)
  id: number;

  @Field()
  @MaxLength(30)
  name: string;

  @Field()
  totalMinutes: number;

  @Field()
  delete: boolean;
}
