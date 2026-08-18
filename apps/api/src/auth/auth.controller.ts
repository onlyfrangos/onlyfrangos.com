import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  @Post("register")
  register(@Body() body: { username: string; email: string; password: string }) {
    return {
      message: "Registration endpoint ready",
      user: { username: body.username, email: body.email }
    };
  }

  @Post("login")
  login(@Body() body: { email: string; password: string }) {
    return {
      accessToken: "dev-access-token",
      refreshToken: "dev-refresh-token",
      user: { email: body.email }
    };
  }

  @Post("refresh")
  refresh() {
    return { accessToken: "dev-access-token-refreshed" };
  }

  @Post("logout")
  logout() {
    return { success: true };
  }
}
