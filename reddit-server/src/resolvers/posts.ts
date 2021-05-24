import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../entities/Posts";
import { MyContext } from "../types";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id") _id: number, @Ctx() { em }: MyContext): Promise<Post | null> {
    return em.findOne(Post, { _id });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post> {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") _id: number,
    @Arg("title") title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { _id });
    if (!post) {
      return null;
    }
    post.title = title;
    await em.flush();
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id") _id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    const num = await em.nativeDelete(Post, { _id });
    if (!num) {
      return false;
    }
    return true;
  }
}
