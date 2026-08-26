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
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SessionClient } from '@prisma/client';
import type { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { AdminGuard } from './admin.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { MobileLoginDto } from './dto/mobile-login.dto';
import { MobileLogoutDto } from './dto/mobile-logout.dto';
import { MobileRegisterDto } from './dto/mobile-register.dto';
import { RefreshDto } from './dto/refresh.dto';

const REFRESH_COOKIE_NAME = 'of_refresh_token';
const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private refreshCookieOptions() {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      path: '/api/v1/auth',
      maxAge: REFRESH_COOKIE_MAX_AGE_MS,
    };
  }

  private getRefreshTokenFromCookie(request: Request, isRequired?: true): string;
  private getRefreshTokenFromCookie(request: Request, isRequired: false): string | null;
  private getRefreshTokenFromCookie(request: Request, isRequired = true): string | null {
    const cookieHeader = request.headers.cookie;

    if (!cookieHeader) {
      if (isRequired) {
        throw new UnauthorizedException('Missing refresh token');
      }

      return null;
    }

    const cookieEntry = cookieHeader
      .split(';')
      .map((item) => item.trim())
      .find((item) => item.startsWith(`${REFRESH_COOKIE_NAME}=`));

    if (!cookieEntry) {
      if (isRequired) {
        throw new UnauthorizedException('Missing refresh token');
      }

      return null;
    }

    const token = decodeURIComponent(cookieEntry.slice(`${REFRESH_COOKIE_NAME}=`.length));

    if (!token) {
      if (isRequired) {
        throw new UnauthorizedException('Missing refresh token');
      }

      return null;
    }

    return token;
  }

  @Get('username-availability')
  usernameAvailability(@Query('username') username = '') {
    return this.authService.isUsernameAvailable(username);
  }

  @Get('policies')
  policies() {
    return this.authService.getCurrentPolicyVersions();
  }

  @Post('register')
  async register(@Body() body: RegisterDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.register(body);
    response.cookie(REFRESH_COOKIE_NAME, result.refreshToken, this.refreshCookieOptions());

    return {
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.login(body);
    response.cookie(REFRESH_COOKIE_NAME, result.refreshToken, this.refreshCookieOptions());

    return {
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  @Post('admin/impersonate/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async impersonate(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.impersonate(id);
    response.cookie(REFRESH_COOKIE_NAME, result.refreshToken, this.refreshCookieOptions());

    return {
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  @Post('refresh')
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.refresh(
      this.getRefreshTokenFromCookie(request),
      SessionClient.WEB,
    );
    response.cookie(REFRESH_COOKIE_NAME, result.refreshToken, this.refreshCookieOptions());

    return {
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  @Post('logout')
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = this.getRefreshTokenFromCookie(request, false);
    if (refreshToken) {
      await this.authService.logout(refreshToken, SessionClient.WEB);
    }

    response.clearCookie(REFRESH_COOKIE_NAME, {
      path: '/api/v1/auth',
    });

    return { success: true };
  }

  @Post('mobile/register')
  async mobileRegister(@Body() body: MobileRegisterDto) {
    const result = await this.authService.register(
      { ...body, policyAcceptance: body.policyAcceptance },
      {
        clientType: SessionClient.MOBILE,
        deviceId: body.device.id,
        deviceName: `${body.device.platform}: ${body.device.name ?? 'OnlyFrangos'}`,
      },
    );

    return result;
  }

  @Post('mobile/login')
  mobileLogin(@Body() body: MobileLoginDto) {
    return this.authService.login(body, {
      clientType: SessionClient.MOBILE,
      deviceId: body.device.id,
      deviceName: `${body.device.platform}: ${body.device.name ?? 'OnlyFrangos'}`,
    });
  }

  @Post('mobile/refresh')
  mobileRefresh(@Body() body: RefreshDto) {
    return this.authService.refresh(body.refreshToken, SessionClient.MOBILE);
  }

  @Post('mobile/logout')
  async mobileLogout(@Body() body: MobileLogoutDto) {
    await this.authService.logout(body.refreshToken, SessionClient.MOBILE);
    return { success: true };
  }
}
