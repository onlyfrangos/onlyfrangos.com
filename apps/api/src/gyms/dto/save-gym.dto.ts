import { IsInt, IsString, MaxLength, Min, MinLength } from "class-validator";

export class SaveGymDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @IsInt()
  @Min(1)
  cityId!: number;
}
