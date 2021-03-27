
import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

/**
 * @Query - is used to the get the data
 * @Mutation - is used to update, insert, delete
 * @Ctx - is the context which is got from apollo server config in index.js 
 *      passed the orm reference to work with graphql
 */
@Resolver()
export class PostResolver{
    @Query(()=> [Post])
    posts(@Ctx() {em}: MyContext ): Promise<Post[]> {
       return em.find(Post, {}) 
    }

    @Query(() => Post, {nullable: true})
    post(
        @Arg("id") id: number,
        @Ctx() { em}: MyContext
    ): Promise<Post | null> {
        return em.findOne(Post, {id});
    }

    
    @Mutation(() => Post)
    async createPost(
        @Arg("title") title: string,
        @Ctx() {em}: MyContext
    ): Promise<Post> {
        const post = em.create(Post,{title})
        await em.persistAndFlush(post);
        return post;
    }

    @Mutation(() => Post, {nullable: true})
    async updatePost(
        @Arg("id") id: number,
        @Arg("title", () => String, {nullable: true}) title: string,
        @Ctx() {em}: MyContext
    ): Promise<Post | null> {
        const post = await em.findOne(Post, { id });
        if (!post) {
            return null;
        }

        if (typeof title !== "undefined" && title.length > 0) {
            post.title = title;
            await em.persistAndFlush(post);
        }
       
        return post;
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg("id") id: number,
        @Ctx() {em}: MyContext
    ): Promise<boolean> {
        await em.nativeDelete(Post, { id });
        return true;
    }
}