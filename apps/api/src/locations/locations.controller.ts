import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PrismaService } from '../shared/prisma.service';

@ApiTags('locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('states')
  states() {
    return this.prisma.state.findMany({
      select: { codigoUf: true, uf: true, nome: true },
      orderBy: { nome: 'asc' },
    });
  }

  @Get('cities')
  cities(@Query('stateId') stateId?: string) {
    const codigoUf = Number(stateId);
    return this.prisma.city.findMany({
      where: Number.isInteger(codigoUf) ? { codigoUf } : undefined,
      select: { codigoIbge: true, nome: true, codigoUf: true },
      orderBy: { nome: 'asc' },
    });
  }
}
