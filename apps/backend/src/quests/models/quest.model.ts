import { Field, ID, Int, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "quset " })
export class Quest {
  @Field((type) => Int)
  id: number;

  @Field((type) => ID)
  uid: string;

  @Field()
  name: string;

  @Field()
  totalMinutes: number;

  @Field()
  delete: boolean;

  @Field()
  createdAt: string;

  @Field({ nullable: true })
  updatedAt: string;
}
