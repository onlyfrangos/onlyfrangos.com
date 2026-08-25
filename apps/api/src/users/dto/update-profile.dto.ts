import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  name!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-z0-9._]+$/, {
    message: 'username must contain only lowercase letters, numbers, dots, and underscores',
  })
  username!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsInt()
  @Min(13)
  @Max(120)
  age!: number | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  cityId!: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  bio?: string;

  @IsOptional()
  @IsUUID()
  gymId?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  fitnessGoal?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  weight?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  bodyFat?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  arm?: string;

  @IsBoolean()
  showGym!: boolean;

  @IsBoolean()
  showCity!: boolean;

  @IsBoolean()
  showPhysicalInfo!: boolean;
}
