import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { UsersService } from "./users.service";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(":username")
  getByUsername(@Param("username") username: string) {
    return this.usersService.getByUsername(username);
  }

  @Get(":username/posts")
  getPostsByUsername(@Param("username") username: string) {
    return this.usersService.getPostsByUsername(username);
  }
}
