import { User } from "../entities/User";
import { MyContext } from "../types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from "argon2";

@InputType()
class UserNamePasswordInput{
    @Field()
    username: string;

    @Field()
    password: string;
}

@ObjectType()
class FieldError{
    @Field()
    field: string;

    @Field()
    message: string;
}
  
@ObjectType()
class UserResponse{
    @Field(()=> [FieldError], { nullable: true })
    error?: FieldError[];

    @Field(()=> User, { nullable :true })
    user?: User;
}

@Resolver()
export class UserResolver {
    @Query(() => User, { nullable: true })
    async me(
        @Ctx() {req, em}: MyContext
    ): Promise<User | null> {
        if (!req.session.userId) {
            return null
        }
        const user = await em.findOne(User, { id: req.session.userId });
        return user;
    }    

    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UserNamePasswordInput,
        @Ctx() {em}: MyContext
    ): Promise<UserResponse> {
        if (options.username.length <= 2) {
            return {
                error: [{
                    field: "username",
                    message: "length must be greater then 2"
                }]
            }
        }

        if (options.password.length <= 5) {
            return {
                error: [{
                    field: "password",
                    message: "length must be greater then 5"
                }]
            }
        }
        const hashPassword = await argon2.hash(options.password)
        const user = em.create(User, {
            username: options.username,
            password: hashPassword
        });
        try {
            await em.persistAndFlush(user);
        } catch (err) {
            if (err.code === "23505") {
                return {
                    error: [
                        {
                            field: "username",
                            message: "username already taken"
                        }
                    ]
                }
            }
            return err;
        }
        
        return { user };
    }

    @Query(() => [User])
    users(
        @Ctx() {em}: MyContext
    ) {
        return em.find(User, {});
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("options") options: UserNamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, { username: options.username })
        if (!user) {
            return {
                error: [{
                    field: "username",
                    message: "That username doesn't exist"
                }]
            }
        }
        const password = await argon2.verify(user.password, options.password);
        if (!password) {
            return {
                error: [{
                    field: "password",
                    message: "Password doesn't match"
                }]
            }
        }

        req.session.userId = user.id;

        return {
            user
        };
    }
}