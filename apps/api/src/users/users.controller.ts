import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { AvatarStorageService } from './avatar-storage.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AdminSaveUserDto } from './dto/admin-save-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly avatarStorage: AvatarStorageService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() request: { user: { sub: string } }) {
    return this.usersService.getById(request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@Req() request: { user: { sub: string } }, @Body() body: UpdateProfileDto) {
    return this.usersService.updateProfile(request.user.sub, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('avatar', { limits: { fileSize: 5 * 1024 * 1024 } }))
  async uploadAvatar(
    @Req() request: { user: { sub: string } },
    @UploadedFile() file?: { buffer: Buffer; mimetype: string; originalname: string; size: number },
  ) {
    if (!file || !['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      throw new BadRequestException('Envie uma imagem JPG, PNG ou WebP de até 5 MB');
    }

    const avatarUrl = await this.avatarStorage.save(request.user.sub, file);
    return this.usersService.updateAvatar(request.user.sub, avatarUrl);
  }

  @Get('avatar-files/:filename')
  async getAvatarFile(@Param('filename') filename: string, @Res() response: Response) {
    return response.sendFile(await this.avatarStorage.getLocalFile(filename));
  }

  @Get('suggestions')
  getSuggestions(@Query('limit') limit?: string) {
    return this.usersService.getSuggestions(limit ? Number(limit) : 5);
  }

  @Get('me/suggestions')
  @UseGuards(JwtAuthGuard)
  getMySuggestions(@Req() request: { user: { sub: string } }, @Query('limit') limit?: string) {
    return this.usersService.getSuggestions(limit ? Number(limit) : 5, request.user.sub);
  }

  @Get('admin/list')
  @UseGuards(JwtAuthGuard, AdminGuard)
  adminList(@Query('page') page?: string, @Query('search') search = '') {
    return this.usersService.adminList(Number(page) || 1, search);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, AdminGuard)
  adminCreate(@Body() body: AdminSaveUserDto) {
    return this.usersService.adminCreate(body);
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  adminGet(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.adminGet(id);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  adminUpdate(@Param('id', ParseUUIDPipe) id: string, @Body() body: AdminSaveUserDto) {
    return this.usersService.adminUpdate(id, body);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  adminDelete(@Param('id', ParseUUIDPipe) id: string, @Req() request: { user: { sub: string } }) {
    return this.usersService.adminDelete(id, request.user.sub);
  }

  @Get(':username')
  getByUsername(@Param('username') username: string) {
    return this.usersService.getByUsername(username);
  }

  @Get(':username/posts')
  getPostsByUsername(@Param('username') username: string) {
    return this.usersService.getPostsByUsername(username);
  }
}
