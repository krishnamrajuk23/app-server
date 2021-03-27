import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

/**
 * @ObjectType and @Field are both decorators are related to the Graphql
 */
@ObjectType()
@Entity()
export class Post {
    @Field()
    @PrimaryKey()
    id!: number;

    @Field()
    @Property({ type: "string" })
    title!: string;

    @Field(()=> String)
    @Property({type: 'Date'})
    createdAt = new Date();

    @Field(()=> String)
    @Property({ type: 'Date', onUpdate: () => new Date()})
    updatedAt = new Date();
}