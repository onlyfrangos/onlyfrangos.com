import { IsString, MaxLength, MinLength } from 'class-validator';

export class PolicyAcceptanceDto {
  @IsString()
  @MinLength(1)
  @MaxLength(32)
  termsVersion!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(32)
  privacyPolicyVersion!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(32)
  communityGuidelinesVersion!: string;
}
