import { Module } from "@nestjs/common";

import { GymsController } from "./gyms.controller";

@Module({
  controllers: [GymsController]
})
export class GymsModule {}
