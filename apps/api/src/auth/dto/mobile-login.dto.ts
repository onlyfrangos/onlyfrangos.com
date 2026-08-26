import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { LoginDto } from './login.dto';
import { MobileClientDto } from './mobile-client.dto';

export class MobileLoginDto extends LoginDto {
  @ValidateNested()
  @Type(() => MobileClientDto)
  device!: MobileClientDto;
}
