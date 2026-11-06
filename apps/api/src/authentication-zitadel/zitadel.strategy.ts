import { Inject, Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ZitadelIntrospectionStrategy } from "passport-zitadel";
import { MODULE_OPTIONS_TOKEN } from "./zitadel-auth.module-definition";
import { ZitadelAuthModuleConfig } from "./zitadel-types";

@Injectable()
export class ZitadelStrategy extends PassportStrategy(
  ZitadelIntrospectionStrategy,
  "zitadel",
) {
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    options: ZitadelAuthModuleConfig,
  ) {
    super(options);
  }

  private readonly logger = new Logger(ZitadelStrategy.name);

  /**
   * passport-zitadel runs the OIDC discovery outside of its try/catch.
   * If Zitadel is unreachable, the rejected promise is never handled
   * and crashes the whole process. We catch it and fail the request instead.
   */
  async authenticate(req: Request): Promise<void> {
    try {
      await super.authenticate(req);
    } catch (error) {
      this.logger.error("Zitadel authentication failed", error);
      const strategy = this as unknown as { error: (err: unknown) => void };
      strategy.error(error);
    }
  }

  async validate(token: string): Promise<string> {
    return token;
  }
}
