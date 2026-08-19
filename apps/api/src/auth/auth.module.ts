import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { PrismaModule } from "../shared/prisma.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET ?? "dev-secret",
      signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN ?? "15m" }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
