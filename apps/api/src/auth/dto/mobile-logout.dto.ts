import { IsString, MinLength } from 'class-validator';

export class MobileLogoutDto {
  @IsString()
  @MinLength(10)
  refreshToken!: string;
}
