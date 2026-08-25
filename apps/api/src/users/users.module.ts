import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { AvatarStorageService } from './avatar-storage.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService, AvatarStorageService],
  exports: [AvatarStorageService],
})
export class UsersModule {}
