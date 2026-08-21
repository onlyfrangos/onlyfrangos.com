import { Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";

@Module({
  imports: [AuthModule],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
