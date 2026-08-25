import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

import { PrismaService } from "../shared/prisma.service";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{ user?: { sub?: string } }>();
    const userId = request.user?.sub;
    if (!userId) throw new ForbiddenException("Acesso restrito a administradores");

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true }
    });
    if (!user?.isAdmin) throw new ForbiddenException("Acesso restrito a administradores");
    return true;
  }
}
