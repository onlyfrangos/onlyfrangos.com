import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { PostsService } from "./posts.service";

@ApiTags("posts")
@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get(":id")
  getById(@Param("id") id: string) {
    return this.postsService.getById(id);
  }

  @Post()
  create(@Body() body: { authorId: string; caption: string; imageUrl: string }) {
    return this.postsService.create(body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.postsService.remove(id);
  }
}
