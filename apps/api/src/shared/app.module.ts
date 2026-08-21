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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", "../../.env"]
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
