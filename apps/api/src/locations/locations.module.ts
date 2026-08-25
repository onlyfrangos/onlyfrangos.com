import { Module } from "@nestjs/common";
import { LocationsController } from "./locations.controller";

@Module({ controllers: [LocationsController] })
export class LocationsModule {}
