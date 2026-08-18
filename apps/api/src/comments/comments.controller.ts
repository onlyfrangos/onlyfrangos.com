import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { CommentsService } from "./comments.service";

@ApiTags("comments")
@Controller("posts/:id/comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  getByPost(@Param("id") postId: string) {
    return this.commentsService.getByPost(postId);
  }

  @Post()
  create(@Param("id") postId: string, @Body() body: { userId: string; content: string }) {
    return this.commentsService.create(postId, body);
  }
}
