import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength
} from "class-validator";

export class AdminSaveUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  name!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-z0-9._]+$/)
  username!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsInt()
  @Min(13)
  @Max(120)
  age!: number | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  cityId!: number | null;

  @IsBoolean()
  isAdmin!: boolean;
}
