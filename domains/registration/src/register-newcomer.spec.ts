import { beforeEach, describe, expect, it } from "vitest";
import {
  accountStatuses,
  ExistingAccountFulfilledRegistration,
  FulfilledRegistration,
  NewAccountFulfilledRegistration,
  Teams,
} from "./register-form/fulfilled-registration.js";
import { KARNA, TECKOS } from "@overbookd/team-code";
import { RegisterNewcomer } from "./register-newcomer.js";
import { InMemoryNewcomerRepository } from "./newcomer-repository.inmemory.js";
import { STAFF, VOLUNTEER } from "./newcomer.js";
import { RegistrationError } from "./register-form/registration.error.js";

const email = "test@example.com";
const firstName = "Titouan";
const lastName = "Moula";
const password = "P4ssW0rd123^";
const mobilePhone = "0601020304";
const birthDate = new Date("2000-01-01");
const comment = "Vous etes les meilleurs ! <3";
const teams: Teams = [KARNA, TECKOS];
const nickname = "Shagou";

const staffRegisterForm: NewAccountFulfilledRegistration = {
  status: accountStatuses.NEW,
  lastName,
  firstName,
  mobilePhone,
  password,
  comment,
  birthDate,
  teams,
  nickname,
  email,
  hasApprovedEULA: true,
};

const volunteerRegisterForm: FulfilledRegistration = {
  ...staffRegisterForm,
  hasSignedVolunteerCharter: true,
};

const staffRegisterFormWithoutPassword: ExistingAccountFulfilledRegistration = {
  status: accountStatuses.EXISTING,
  lastName,
  firstName,
  mobilePhone,
  comment,
  birthDate,
  teams,
  nickname,
  email,
  hasApprovedEULA: true,
};

const volunteerRegisterFormWithoutPassword: FulfilledRegistration = {
  ...staffRegisterFormWithoutPassword,
  hasSignedVolunteerCharter: true,
};

let registerNewcomer: RegisterNewcomer;
let newcomerRepository: InMemoryNewcomerRepository;

describe("Register newcomer", () => {
  describe("Form validation and storage", () => {
    beforeEach(() => {
      newcomerRepository = new InMemoryNewcomerRepository();
      registerNewcomer = new RegisterNewcomer(newcomerRepository);
    });
    describe.each`
      membership   | registerForm
      ${STAFF}     | ${staffRegisterForm}
      ${VOLUNTEER} | ${volunteerRegisterForm}
    `(
      "when receiving a valid $membership registration with password required",
      ({ membership, registerForm }) => {
        it("should register the associated newcomer", async () => {
          const registree = await registerNewcomer.fromRegisterForm(
            registerForm,
            membership,
            accountStatuses.NEW,
          );
          const { password, status, ...personalData } = registerForm;
          const expectedRegistree = { ...personalData, id: 1, membership };
          expect(registree).toStrictEqual(expectedRegistree);
          expect(newcomerRepository.registrees).toContainEqual(
            expectedRegistree,
          );
        });
        describe("when receiving newcomer with upper chars in email", () => {
          const SCHLAGOS_PROTONMAIL = "schla.gos@protonmail.com";
          it.each`
            registerEmail                 | expectedEmail
            ${"Schla.gos@protonmail.com"} | ${SCHLAGOS_PROTONMAIL}
            ${"Schla.Gos@protonmail.com"} | ${SCHLAGOS_PROTONMAIL}
            ${"SchLa.gos@protonmail.com"} | ${SCHLAGOS_PROTONMAIL}
            ${"schla.gos@protonmail.Com"} | ${SCHLAGOS_PROTONMAIL}
            ${"SCHLA.GOS@PROTONMAIL.COM"} | ${SCHLAGOS_PROTONMAIL}
          `(
            "should register $registerEmail newcomer with $expectedEmail as email",
            async ({ registerEmail, expectedEmail }) => {
              const form = { ...registerForm, email: registerEmail };
              const { email } = await registerNewcomer.fromRegisterForm(
                form,
                membership,
                accountStatuses.NEW,
              );
              expect(email).toBe(expectedEmail);
            },
          );
        });
        describe("when 2 newcomers are received", () => {
          it("should generate different id for both", async () => {
            const firstForm = {
              ...registerForm,
              email: "le.tchad@protonmail.com",
            };
            const secondForm = {
              ...registerForm,
              email: "brole@protonmail.com",
            };
            const [firstRegistree, secondRegistree] = await Promise.all([
              registerNewcomer.fromRegisterForm(
                firstForm,
                membership,
                accountStatuses.NEW,
              ),
              registerNewcomer.fromRegisterForm(
                secondForm,
                membership,
                accountStatuses.NEW,
              ),
            ]);
            expect(firstRegistree.id).not.toBe(secondRegistree.id);
          });
        });
        describe("when receiving newcomer with space(s) in email", () => {
          it.each`
            registerEmail
            ${" T adk @gmail.com"}
            ${"Tadk @gmail.com"}
            ${"t adk@gmail.com"}
          `(
            "should indicate that $registerEmail is not valid email",
            async ({ registerEmail }) => {
              await expect(async () =>
                registerNewcomer.fromRegisterForm(
                  { ...registerForm, email: registerEmail },
                  STAFF,
                  accountStatuses.NEW,
                ),
              ).rejects.toThrow(RegistrationError);
            },
          );
        });
      },
    );
    describe.each`
      membership   | registerForm
      ${STAFF}     | ${staffRegisterFormWithoutPassword}
      ${VOLUNTEER} | ${volunteerRegisterFormWithoutPassword}
    `(
      "when receiving a valid $membership registration without password required",
      ({ membership, registerForm }) => {
        it("should register the associated newcomer without password", async () => {
          const registree = await registerNewcomer.fromRegisterForm(
            registerForm,
            membership,
            accountStatuses.EXISTING,
          );

          const { status, ...personalData } = registerForm;
          const expectedRegistree = { ...personalData, id: 1, membership };
          expect(registree).toStrictEqual(expectedRegistree);
          expect(registree).not.toHaveProperty("password");
          expect(newcomerRepository.registrees).toContainEqual(
            expectedRegistree,
          );
        });
        it("should ignore provided password", async () => {
          const formWithPassword = { ...registerForm, password };
          const registree = await registerNewcomer.fromRegisterForm(
            formWithPassword,
            membership,
            accountStatuses.EXISTING,
          );

          const { status, ...personalData } = registerForm;
          const expectedRegistree = { ...personalData, id: 1, membership };
          expect(registree).toStrictEqual(expectedRegistree);
          expect(registree).not.toHaveProperty("password");
        });
      },
    );
    describe.each`
      membership   | registerForm
      ${STAFF}     | ${staffRegisterFormWithoutPassword}
      ${VOLUNTEER} | ${volunteerRegisterFormWithoutPassword}
    `(
      "when receiving a $membership registration without password while password is required",
      ({ membership, registerForm }) => {
        it("should reject the registration", async () => {
          await expect(async () =>
            registerNewcomer.fromRegisterForm(
              registerForm,
              membership,
              accountStatuses.NEW,
            ),
          ).rejects.toThrow(RegistrationError);
        });
      },
    );
  });
});
