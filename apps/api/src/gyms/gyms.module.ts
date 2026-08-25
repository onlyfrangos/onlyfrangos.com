import { Module } from "@nestjs/common";

import { GymsController } from "./gyms.controller";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [GymsController]
})
export class GymsModule {}
