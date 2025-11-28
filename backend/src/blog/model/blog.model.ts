import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Blog {
    @Field()
    id: string;

    @Field()
    title: string;

    @Field()
    content: string;

    @Field()
    authorId: string;

    @Field()
    authorName: string;

    @Field()
    authorEmail: string;

    @Field()
    createdAt: string;
}
