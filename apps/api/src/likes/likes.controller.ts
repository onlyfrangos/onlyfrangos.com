import { Body, Controller, Delete, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { LikesService } from "./likes.service";

@ApiTags("likes")
@Controller("posts/:id/likes")
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  like(@Param("id") postId: string, @Body() body: { userId: string }) {
    return this.likesService.like(postId, body.userId);
  }

  @Delete()
  unlike(@Param("id") postId: string, @Body() body: { userId: string }) {
    return this.likesService.unlike(postId, body.userId);
  }
}
