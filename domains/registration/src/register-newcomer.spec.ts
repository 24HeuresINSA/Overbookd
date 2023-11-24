import { beforeAll, describe, expect, it } from "vitest";
import {
  FulfilledRegistration,
  KARNA_CODE,
  TECKOS_CODE,
  Teams,
} from "./register-form";
import { RegisterNewcomer } from "./register-newcomer";
import { InMemoryNewcomerRepository } from "./newcomer-repository.inmemory";
import { AdherentRegistered, NewcomerRegisteredEvent } from "./event";
import { ENROLL_ADHERENT, READ_FA, READ_FT } from "@overbookd/permission";
import { InMemoryNotificationRepository } from "./notification-repository.inmemory";
import { StoredNotifyee } from "./notification-repository.inmemory";

const notifyees: StoredNotifyee[] = [
  { id: 100, permissions: [] },
  { id: 101, permissions: [READ_FA] },
  { id: 102, permissions: [READ_FA, READ_FT, ENROLL_ADHERENT] },
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

describe("Register newcomer", () => {
  beforeAll(() => {
    const newcomerRepository = new InMemoryNewcomerRepository();
    const notificationRepository = new InMemoryNotificationRepository(
      notifyees,
    );
    registerNewcomer = new RegisterNewcomer(
      newcomerRepository,
      notificationRepository,
    );
  });
  describe("when receiving a fulfilled registration", () => {
    it("should register the associated newcomer", async () => {
      const registree = await registerNewcomer.fromRegisterForm(registerForm);
      const { password, ...personalData } = registerForm;
      expect(registree).toStrictEqual({ ...personalData, id: 1 });
    });
  });
  describe("when 2 newcomers are receiving", () => {
    it("should generate different id for both", async () => {
      const [firstRegistree, secondRegistree] = await Promise.all([
        registerNewcomer.fromRegisterForm({
          ...registerForm,
          email: "le.tchad@protonmail.com",
        }),
        registerNewcomer.fromRegisterForm({
          ...registerForm,
          email: "brole@protonmail.com",
        }),
      ]);
      expect(firstRegistree.id).not.toBe(secondRegistree.id);
    });
  });
  describe("when an existing newcomer has the same email", () => {
    beforeAll(() => {
      const newcomerRepository = new InMemoryNewcomerRepository([
        {
          id: 1,
          firstname,
          lastname,
          mobilePhone,
          comment,
          birthdate,
          teams,
          nickname,
          email,
        },
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
        registerNewcomer.fromRegisterForm(registerForm),
      ).rejects.toThrowError(
        "Erreur lors de l'inscription:\nL'email est déja utilisé par un autre utilisateur",
      );
    });
  });
  describe("Notification", () => {
    let newcomerRegistered: AdherentRegistered;
    beforeAll(async () => {
      const newcomerRepository = new InMemoryNewcomerRepository();
      const notificationRepository = new InMemoryNotificationRepository(
        notifyees,
      );
      const registerNewcomer = new RegisterNewcomer(
        newcomerRepository,
        notificationRepository,
      );
      const registree = await registerNewcomer.fromRegisterForm(registerForm);
      newcomerRegistered = NewcomerRegisteredEvent.create(
        registree,
        "adherent",
      );
    });
    describe("when a new adherent has been registered", () => {
      it("should generate a notification for 'can enroll adherent' users", async () => {
        const notifees = await registerNewcomer.notifyNewAdherentAwaits(
          newcomerRegistered,
        );
        expect(notifees).toHaveLength(1);
      });
    });
  });
});
