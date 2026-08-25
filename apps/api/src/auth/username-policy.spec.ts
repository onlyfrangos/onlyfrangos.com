import { ConflictException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { PrismaService } from "../shared/prisma.service";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";
import { isReservedUsername, normalizeUsernameForPolicy } from "./username-policy";

describe("username policy", () => {
  it.each([
    "admin",
    "ADMIN",
    "admin_",
    "_admin",
    "admin.oficial",
    "admin-oficial",
    "official_admin"
  ])("blocks the reserved variation %s", (username) =>
    expect(isReservedUsername(username)).toBe(true)
  );

  it("blocks reserved usernames with numeric suffixes", () => {
    expect(isReservedUsername("admin123")).toBe(true);
    expect(isReservedUsername("instagram2026")).toBe(true);
    expect(isReservedUsername("onlyfrangos123")).toBe(true);
  });

  it("normalizes Unicode equivalents for comparison", () => {
    expect(normalizeUsernameForPolicy("Admín")).toBe("admin");
    expect(isReservedUsername("Admín")).toBe(true);
  });

  it("allows normal usernames that merely contain a reserved substring", () => {
    expect(isReservedUsername("administracaoativa")).toBe(false);
    expect(isReservedUsername("joaosuporteiro")).toBe(false);
  });

  it("allows a username outside the reserved list", () => {
    expect(isReservedUsername("joaomaria")).toBe(false);
  });
});

describe("reserved username enforcement", () => {
  it("rejects account creation before querying or writing the database", async () => {
    const prisma = {
      user: { findFirst: jest.fn(), create: jest.fn() }
    } as unknown as PrismaService;
    const service = new AuthService(prisma, { sign: jest.fn() } as unknown as JwtService);

    await expect(
      service.register({
        username: "admin123",
        email: "admin@example.com",
        password: "secret123",
        fullName: "Admin Teste",
        age: 25,
        cityId: 2304400
      })
    ).rejects.toThrow(ConflictException);
    expect(
      (prisma as unknown as { user: { findFirst: jest.Mock } }).user.findFirst
    ).not.toHaveBeenCalled();
  });

  it("rejects a reserved username during profile editing", async () => {
    const prisma = { user: { findFirst: jest.fn() } } as unknown as PrismaService;
    const service = new UsersService(prisma);

    await expect(
      service.updateProfile("user-1", {
        name: "João Maria",
        username: "official_admin",
        email: "joao@example.com",
        age: 25,
        cityId: 2304400,
        showGym: true,
        showCity: true,
        showPhysicalInfo: true
      })
    ).rejects.toThrow(ConflictException);
    expect(
      (prisma as unknown as { user: { findFirst: jest.Mock } }).user.findFirst
    ).not.toHaveBeenCalled();
  });
});
