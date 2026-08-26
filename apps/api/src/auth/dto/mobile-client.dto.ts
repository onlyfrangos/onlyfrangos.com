import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class MobileClientDto {
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  id!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsIn(['android', 'ios'])
  platform!: 'android' | 'ios';
}
