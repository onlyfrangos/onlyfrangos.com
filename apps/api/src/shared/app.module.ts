import fs from "node:fs";
import path from "node:path";

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "../auth/auth.module";
import { CommentsModule } from "../comments/comments.module";
import { FeedModule } from "../feed/feed.module";
import { FollowsModule } from "../follows/follows.module";
import { GymsModule } from "../gyms/gyms.module";
import { LikesModule } from "../likes/likes.module";
import { PostsModule } from "../posts/posts.module";
import { UsersModule } from "../users/users.module";
import { PrismaModule } from "./prisma.module";

const possibleEnvPaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../../.env"),
  path.resolve(__dirname, "../../../.env"),
  path.resolve(__dirname, "../../../../.env")
].filter((value, index, array) => array.indexOf(value) === index);

const envFilePath = possibleEnvPaths.find((file) => fs.existsSync(file)) ?? possibleEnvPaths[0];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [envFilePath]
    }),
    PrismaModule,
    AuthModule,
    FeedModule,
    UsersModule,
    PostsModule,
    FollowsModule,
    LikesModule,
    CommentsModule,
    GymsModule
  ]
})
export class AppModule {}
