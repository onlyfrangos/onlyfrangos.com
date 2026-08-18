import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { FeedService } from "./feed.service";

@ApiTags("feed")
@Controller("feed")
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  getFeed(@Query("limit") limit?: string, @Query("cursor") cursor?: string) {
    return this.feedService.getFeed(limit ? Number(limit) : 20, cursor);
  }
}
