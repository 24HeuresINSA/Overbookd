import { beforeEach, describe, expect, it } from "vitest";
import {
  FulfilledRegistration,
  KARNA_CODE,
  RegistrationError,
  TECKOS_CODE,
  Teams,
} from "./register-form";
import { RegisterNewcomer } from "./register-newcomer";
import { InMemoryNewcomerRepository } from "./newcomer-repository.inmemory";
import {
  ENROLL_HARD,
  ENROLL_SOFT,
  READ_FA,
  READ_FT,
} from "@overbookd/permission";
import { InMemoryNotificationRepository } from "./notification-repository.inmemory";
import { StoredNotifyee } from "./notification-repository.inmemory";
import { ADHERENT, NewcomerRegistered, VOLUNTEER } from "./newcomer";

const notifyees: StoredNotifyee[] = [
  { id: 100, permissions: [] },
  { id: 101, permissions: [READ_FA] },
  { id: 102, permissions: [READ_FA, READ_FT, ENROLL_HARD] },
  { id: 103, permissions: [READ_FA, READ_FT, ENROLL_SOFT] },
];

const email = "test@example.com";
const firstname = "Titouan";
const lastname = "Moula";
const password = "P4ssW0rd123^";
const mobilePhone = "0601020304";
const birthdate = new Date("2000-01-01");
const comment = "Vous etes les meilleurs ! <3";
const teams: Teams = [KARNA_CODE, TECKOS_CODE];
const nickname = "Shagou";

const firstNewComer: NewcomerRegistered<"adherent"> = {
  id: 1,
  firstname,
  lastname,
  mobilePhone,
  comment,
  birthdate,
  teams,
  nickname,
  email,
  membership: ADHERENT,
};

const registerForm: FulfilledRegistration = {
  lastname,
  firstname,
  mobilePhone,
  password,
  comment,
  birthdate,
  teams,
  nickname,
  email,
};

let registerNewcomer: RegisterNewcomer;
let newcomerRepository: InMemoryNewcomerRepository;

describe("Register newcomer", () => {
  describe("Form validation and storage", () => {
    beforeEach(() => {
      newcomerRepository = new InMemoryNewcomerRepository();
      const notificationRepository = new InMemoryNotificationRepository(
        notifyees,
      );
      registerNewcomer = new RegisterNewcomer(
        newcomerRepository,
        notificationRepository,
      );
    });
    describe.each`
      membership
      ${ADHERENT}
      ${VOLUNTEER}
    `("when receiving a valid $membership registration", ({ membership }) => {
      it("should register the associated newcomer", async () => {
        const registree = await registerNewcomer.fromRegisterForm(
          registerForm,
          membership,
        );
        const { password, ...personalData } = registerForm;
        const expectedRegistree = { ...personalData, id: 1, membership };
        expect(registree).toStrictEqual(expectedRegistree);
        expect(newcomerRepository.registrees).toContainEqual(expectedRegistree);
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
          "should register $registerEmail new comer with $expectedEmail as email",
          async ({ registerEmail, expectedEmail }) => {
            const form = { ...registerForm, email: registerEmail };
            const { email } = await registerNewcomer.fromRegisterForm(
              form,
              membership,
            );
            expect(email).toBe(expectedEmail);
          },
        );
      });
      describe("when 2 newcomers are received", () => {
        it("should generate different id for both", async () => {
          const fistForm = {
            ...registerForm,
            email: "le.tchad@protonmail.com",
          };
          const secondForm = {
            ...registerForm,
            email: "brole@protonmail.com",
          };
          const [firstRegistree, secondRegistree] = await Promise.all([
            registerNewcomer.fromRegisterForm(fistForm, membership),
            registerNewcomer.fromRegisterForm(secondForm, membership),
          ]);
          expect(firstRegistree.id).not.toBe(secondRegistree.id);
        });
      });
      describe("when an existing newcomer has the same email", () => {
        beforeEach(() => {
          const newcomerRepository = new InMemoryNewcomerRepository([
            firstNewComer,
          ]);
          const notificationRepository = new InMemoryNotificationRepository(
            notifyees,
          );
          registerNewcomer = new RegisterNewcomer(
            newcomerRepository,
            notificationRepository,
          );
        });
        it("should indicate that someone is already register with this email", async () => {
          await expect(async () =>
            registerNewcomer.fromRegisterForm(registerForm, membership),
          ).rejects.toThrowError(
            "Erreur lors de l'inscription:\nL'email est déja utilisé par un autre utilisateur",
          );
        });
      });
      describe("when receiving newcomer with space(s) in email", () => {
        it.each`
          registerEmail
          ${" T adk @gmail.com"}
          ${"Tadk @gmail.com"}
          ${"t adk@gmail.com"}
          ${" takd@gmail.com"}
          ${" takd@gmail.com"}
          ${"tadk@gmail.com "}
        `(
          "should indicate that $registerEmail is not valid email",
          async ({ registerEmail }) => {
            expect(
              async () =>
                await registerNewcomer.fromRegisterForm(
                  {
                    ...registerForm,
                    email: registerEmail,
                  },
                  ADHERENT,
                ),
            ).rejects.toThrow(RegistrationError);
          },
        );
      });
    });
  });
  describe("Notification", () => {
    beforeEach(() => {
      newcomerRepository = new InMemoryNewcomerRepository();
      const notificationRepository = new InMemoryNotificationRepository(
        notifyees,
      );
      registerNewcomer = new RegisterNewcomer(
        newcomerRepository,
        notificationRepository,
      );
    });
    describe("when a new adherent has been registered", () => {
      it("should generate a notification for 'can enroll adherent' users", async () => {
        const notifees =
          await registerNewcomer.notifyNewAdherentAwaits(firstNewComer);
        expect(notifees).toHaveLength(1);
        expect(notifees).toEqual([{ id: 102 }]);
      });
    });
    describe("when a new volunteer has been registered", () => {
      it("should generate a notification for 'can enroll volunteer' users", async () => {
        const notifees = await registerNewcomer.notifyNewVolunteerAwaits({
          ...firstNewComer,
          membership: VOLUNTEER,
        });
        expect(notifees).toHaveLength(1);
        expect(notifees).toEqual([{ id: 103 }]);
      });
    });
  });
});
