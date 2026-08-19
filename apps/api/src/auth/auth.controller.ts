import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RefreshDto } from "./dto/refresh.dto";
import { RegisterDto } from "./dto/register.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post("login")
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post("refresh")
  refresh(@Body() body: RefreshDto) {
    return this.authService.refresh(body);
  }

  @Post("logout")
  logout() {
    return { success: true };
  }
}
