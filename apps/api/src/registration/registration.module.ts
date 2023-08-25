import { Module } from "@nestjs/common";
import { RegistrationController } from "./registration.controller";
import { RegistrationService } from "./registration.service";
import {
  InMemoryNewcomerRepository,
  RegisterNewcomer,
} from "@overbookd/registration";

@Module({
  controllers: [RegistrationController],
  providers: [
    {
      provide: RegisterNewcomer,
      useFactory: () => new RegisterNewcomer(new InMemoryNewcomerRepository()),
    },
    {
      provide: RegistrationService,
      useFactory: (registerNewcomer: RegisterNewcomer) =>
        new RegistrationService(registerNewcomer),
      inject: [RegisterNewcomer],
    },
  ],
})
export class RegistrationModule {}
