import { Controller, Delete, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FollowsService } from './follows.service';

@ApiTags('follows')
@Controller('users/:id/follow')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  follow(@Param('id') followingId: string, @Req() request: { user: { sub: string } }) {
    return this.followsService.follow(request.user.sub, followingId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  unfollow(@Param('id') followingId: string, @Req() request: { user: { sub: string } }) {
    return this.followsService.unfollow(request.user.sub, followingId);
  }
}
