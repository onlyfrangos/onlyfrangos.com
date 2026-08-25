import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import type { Request, Response } from "express";

import { AuthService } from "./auth.service";
import { AdminGuard } from "./admin.guard";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

const REFRESH_COOKIE_NAME = "of_refresh_token";
const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private refreshCookieOptions() {
    const isProduction = process.env.NODE_ENV === "production";

    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax" as const,
      path: "/api/v1/auth",
      maxAge: REFRESH_COOKIE_MAX_AGE_MS
    };
  }

  private getRefreshTokenFromCookie(request: Request) {
    const cookieHeader = request.headers.cookie;

    if (!cookieHeader) {
      throw new UnauthorizedException("Missing refresh token");
    }

    const cookieEntry = cookieHeader
      .split(";")
      .map((item) => item.trim())
      .find((item) => item.startsWith(`${REFRESH_COOKIE_NAME}=`));

    if (!cookieEntry) {
      throw new UnauthorizedException("Missing refresh token");
    }

    const token = decodeURIComponent(cookieEntry.slice(`${REFRESH_COOKIE_NAME}=`.length));

    if (!token) {
      throw new UnauthorizedException("Missing refresh token");
    }

    return token;
  }

  @Get("username-availability")
  usernameAvailability(@Query("username") username = "") {
    return this.authService.isUsernameAvailable(username);
  }

  @Post("register")
  async register(@Body() body: RegisterDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.register(body);
    response.cookie(REFRESH_COOKIE_NAME, result.refreshToken, this.refreshCookieOptions());

    return {
      user: result.user,
      accessToken: result.accessToken
    };
  }

  @Post("login")
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.login(body);
    response.cookie(REFRESH_COOKIE_NAME, result.refreshToken, this.refreshCookieOptions());

    return {
      user: result.user,
      accessToken: result.accessToken
    };
  }

  @Post("admin/impersonate/:id")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async impersonate(
    @Param("id", ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const result = await this.authService.impersonate(id);
    response.cookie(REFRESH_COOKIE_NAME, result.refreshToken, this.refreshCookieOptions());

    return {
      user: result.user,
      accessToken: result.accessToken
    };
  }

  @Post("refresh")
  refresh(@Req() request: Request) {
    return this.authService.refresh(this.getRefreshTokenFromCookie(request));
  }

  @Post("logout")
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(REFRESH_COOKIE_NAME, {
      path: "/api/v1/auth"
    });

    return { success: true };
  }
}
