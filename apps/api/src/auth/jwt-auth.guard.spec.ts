import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { JwtAuthGuard } from "./jwt-auth.guard";

describe("JwtAuthGuard", () => {
  it("rejects requests without a bearer token", async () => {
    const jwtService = { verify: jest.fn() } as unknown as JwtService;
    const guard = new JwtAuthGuard(jwtService);
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: {} })
      })
    } as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    expect(jwtService.verify).not.toHaveBeenCalled();
  });

  it("accepts valid bearer tokens and attaches the user payload to the request", async () => {
    const jwtService = {
      verify: jest.fn().mockReturnValue({ sub: "user-1", email: "user@example.com", username: "tester" })
    } as unknown as JwtService;

    const guard = new JwtAuthGuard(jwtService);
    const request = { headers: { authorization: "Bearer valid-token" } } as {
      headers: { authorization: string };
      user?: { sub: string; email: string; username: string };
    };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request
      })
    } as ExecutionContext;

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(request.user).toEqual({ sub: "user-1", email: "user@example.com", username: "tester" });
  });
});
