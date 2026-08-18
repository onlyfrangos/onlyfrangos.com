import { Body, Controller, Delete, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { FollowsService } from "./follows.service";

@ApiTags("follows")
@Controller("users/:id/follow")
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post()
  follow(@Param("id") followingId: string, @Body() body: { followerId: string }) {
    return this.followsService.follow(body.followerId, followingId);
  }

  @Delete()
  unfollow(@Param("id") followingId: string, @Body() body: { followerId: string }) {
    return this.followsService.unfollow(body.followerId, followingId);
  }
}
