import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CommentsService } from "./comments.service";

@ApiTags("comments")
@Controller("posts/:id/comments")
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  getByPost(@Param("id") postId: string, @Req() request: { user: { sub: string } }) {
    return this.commentsService.getByPost(postId, request.user.sub);
  }

  @Post()
  create(@Param("id") postId: string, @Req() request: { user: { sub: string } }, @Body() body: { content: string; parentId?: string | null }) {
    return this.commentsService.create(postId, request.user.sub, body.content, body.parentId);
  }

  @Delete(":commentId")
  remove(@Param("id") postId: string, @Param("commentId") commentId: string, @Req() request: { user: { sub: string } }) {
    return this.commentsService.remove(postId, commentId, request.user.sub);
  }

  @Post(":commentId/likes")
  like(@Param("commentId") commentId: string, @Req() request: { user: { sub: string } }) {
    return this.commentsService.like(commentId, request.user.sub);
  }

  @Delete(":commentId/likes")
  unlike(@Param("commentId") commentId: string, @Req() request: { user: { sub: string } }) {
    return this.commentsService.unlike(commentId, request.user.sub);
  }
}
