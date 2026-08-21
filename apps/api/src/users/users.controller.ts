import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UsersService } from "./users.service";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get("me")
  getMe(@Req() request: { user: { sub: string } }) {
    return this.usersService.getById(request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":username")
  getByUsername(@Param("username") username: string) {
    return this.usersService.getByUsername(username);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":username/posts")
  getPostsByUsername(@Param("username") username: string) {
    return this.usersService.getPostsByUsername(username);
  }
}
