import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { gyms } from "../shared/in-memory-store";

@ApiTags("gyms")
@Controller("gyms")
export class GymsController {
  @Get()
  list() {
    return gyms;
  }

  @Get(":id")
  getById(@Param("id") id: string) {
    return gyms.find((gym) => gym.id === id) ?? null;
  }
}
