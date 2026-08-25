import { Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LikesService } from './likes.service';

@ApiTags('likes')
@Controller('posts/:id/likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@Param('id') postId: string, @Req() request: { user: { sub: string } }) {
    return this.likesService.list(postId, request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  like(@Param('id') postId: string, @Req() request: { user: { sub: string } }) {
    return this.likesService.like(postId, request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  unlike(@Param('id') postId: string, @Req() request: { user: { sub: string } }) {
    return this.likesService.unlike(postId, request.user.sub);
  }
}
