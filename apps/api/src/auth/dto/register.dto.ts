import { IsEmail, IsInt, IsString, Matches, Max, MaxLength, Min, MinLength } from "class-validator";

export class RegisterDto {
  @IsString()
  @MinLength(3)
  @Matches(/^[a-z0-9._]+$/, {
    message: "username must contain only lowercase letters, numbers, dots, and underscores"
  })
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @MinLength(2)
  fullName!: string;

  @IsInt()
  @Min(13)
  @Max(120)
  age!: number;

  @IsInt()
  @Min(1)
  cityId!: number;
}
