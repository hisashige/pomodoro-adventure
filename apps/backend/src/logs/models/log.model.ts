import { Field, ID, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "log " })
export class Log {
  @Field((type) => Int)
  id: number;

  @Field((type) => ID)
  uid: string;

  @Field((type) => Int)
  questId: number;

  @Field()
  enemy: string;

  @Field((type) => Int)
  minutes: number;

  @Field()
  done: boolean;

  @Field()
  startTime: string;

  @Field()
  createdAt: string;

  @Field({ nullable: true })
  updatedAt: string | null;
}
