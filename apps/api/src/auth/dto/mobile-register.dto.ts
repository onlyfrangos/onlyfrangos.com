import { Type } from 'class-transformer';
import { Min, ValidateNested } from 'class-validator';

import { MobileClientDto } from './mobile-client.dto';
import { PolicyAcceptanceDto } from './policy-acceptance.dto';
import { RegisterDto } from './register.dto';

export class MobileRegisterDto extends RegisterDto {
  @Min(18)
  declare age: number;

  @ValidateNested()
  @Type(() => MobileClientDto)
  device!: MobileClientDto;

  @ValidateNested()
  @Type(() => PolicyAcceptanceDto)
  policyAcceptance!: PolicyAcceptanceDto;
}
