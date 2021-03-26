import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Post {
    @PrimaryKey()
    id!: number;

    @Property({type:'text'})
    title!: string;

    @Property({type: 'Date'})
    createdAt = new Date();

    @Property({ type: 'Date', onUpdate: () => new Date()})
    updatedAt = new Date();
}