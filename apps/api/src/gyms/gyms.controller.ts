import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { PrismaService } from "../shared/prisma.service";

@ApiTags("gyms")
@Controller("gyms")
export class GymsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  list() {
    return this.prisma.gym.findMany({ orderBy: { name: "asc" } });
  }

  @Get(":id")
  getById(@Param("id") id: string) {
    return this.prisma.gym.findUnique({ where: { id } });
  }
}
