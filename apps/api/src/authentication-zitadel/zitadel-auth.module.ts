import { Module } from "@nestjs/common";
import { ZitadelStrategy } from "./zitadel.strategy";
import { PassportModule } from "@nestjs/passport";
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
} from "./zitadel-auth.module-definition";

@Module({
  imports: [PassportModule],
  providers: [
    {
      provide: MODULE_OPTIONS_TOKEN,
      useValue: MODULE_OPTIONS_TOKEN,
    },
    ZitadelStrategy,
  ],
  exports: [ZitadelStrategy],
})
export class ZitadelAuthModule extends ConfigurableModuleClass {}
