import { describe, it, expect } from "vitest";
import { Teams } from "./fulfilled-registration.js";
import {
  BDE,
  HAUTS_DE_FRANCE,
  TECKOS,
  TEAM_MONTAGE,
  KARNA,
} from "@overbookd/team-constants";
import { RegisterForm } from "./register-form.js";
import { STAFF, VOLUNTEER } from "../newcomer.js";

const AT_LEAST_12_CHAR_IN_PASSWORD =
  "Il faut au moins 12 caractères dans le mot de passe";
const AT_LEAST_1_NUMBER_IN_PASSWORD =
  "Il faut au moins un chiffre dans le mot de passe";
const AT_LEAST_1_MAJ_IN_PASSWORD =
  "Il faut au moins une MAJUSCULE dans le mot de passe";
const AT_LEAST_1_MIN_IN_PASSWORD =
  "Il faut au moins une minuscule dans le mot de passe";
const AT_LEAST_1_SPECIAL_CHAR_IN_PASSWORD =
  "Il faut au moins un caractère spécial (!@#$%^&*=+_{}[]()|.) dans le mot de passe";

const email = "test@example.com";
const firstname = "Titouan";
const lastname = "Moula";
const password = "P4ssW0rd123^";
const mobilePhone = "0601020304";
const birthdate = new Date("2000-01-01");
const comment = "Vous etes les meilleurs ! <3";
const teams: Teams = [KARNA, TECKOS];
const nickname = "Shagou";

function validForm() {
  return RegisterForm.initFor(VOLUNTEER)
    .fillEmail(email)
    .fillFirstname(firstname)
    .fillLastname(lastname)
    .fillPassword(password)
    .fillMobilePhone(mobilePhone)
    .fillNickname(nickname)
    .fillBirthdate(birthdate)
    .fillComment(comment)
    .fillTeams(teams)
    .approveEndUserLicenceAgreement()
    .signVolunteerCharter();
}

describe("Register form", () => {
  describe("when form is completely filled", () => {
    it("should indicate the form is valid", () => {
      const form = validForm();
      expect(form.isValid).toBe(true);
    });
    describe("when we want to register a newcomer", () => {
      it("should generate a fulfilled form", () => {
        const newcomer = validForm().complete();
        expect(newcomer).toEqual({
          firstname,
          lastname,
          teams,
          comment,
          nickname,
          birthdate,
          password,
          email,
          mobilePhone,
          hasApprovedEULA: true,
          hasSignedVolunteerCharter: true,
        });
      });
    });
  });
  describe("email rules", () => {
    const baseForm = validForm().clearEmail();
    describe("when form is filled with empty email", () => {
      it("should indicate the form is invalid", () => {
        const form = baseForm.fillEmail("");
        expect(form.isValid).toBe(false);
      });
      it("should indicate that email is invalid", () => {
        const form = baseForm.fillEmail("");
        expect(form.reasons).toHaveLength(1);
        expect(form.reasons).include("Adresse mail non valable");
      });
    });
    describe("when form is filled with invalid email", () => {
      it("should indicate the form is invalid", () => {
        const form = baseForm.fillEmail("example.com");
        expect(form.isValid).toBe(false);
      });
      it("should indicate that email is invalid", () => {
        const form = baseForm.fillEmail("example.com");
        expect(form.reasons).toHaveLength(1);
        expect(form.reasons).include("Adresse mail non valable");
      });
    });
    describe("when form is filled with insa email", () => {
      it("should indicate the form is invalid", () => {
        const form = baseForm.fillEmail("example@insa-lyon.fr");
        expect(form.isValid).toBe(false);
      });
      it("should indicate that insa email is forbiden", () => {
        const form = baseForm.fillEmail("example@insa-lyon.fr");
        expect(form.reasons).toHaveLength(1);
        expect(form.reasons).include("Pas d'adresse insa 🙏");
      });
    });
  });
  describe("firstname rules", () => {
    describe("when firstname is filled with empty string", () => {
      const baseForm = validForm().clearFirstname();
      it("should indicate the form is invalid", () => {
        const form = baseForm.fillFirstname("");
        expect(form.isValid).toBe(false);
      });
      it("should indicate that firstname is required", () => {
        const form = baseForm.fillFirstname("");
        expect(form.reasons).toHaveLength(1);
        expect(form.reasons).include("Il faut renseigner un prenom");
      });
    });
  });
  describe("lastname rules", () => {
    describe("when lastname is filled with empty string", () => {
      const baseForm = validForm().clearLastname();
      it("should indicate the form is invalid", () => {
        const form = baseForm.fillLastname("");
        expect(form.isValid).toBe(false);
      });
      it("should indicate that lastname is required", () => {
        const form = baseForm.fillLastname("");
        expect(form.reasons).toHaveLength(1);
        expect(form.reasons).include("Il faut renseigner un nom");
      });
    });
  });
  describe("password rules", () => {
    const baseForm = validForm().clearPassword();
    describe("when password is filled with missing rules", () => {
      describe.each`
        password               | reasons
        ${""}                  | ${[AT_LEAST_1_MIN_IN_PASSWORD, AT_LEAST_1_MAJ_IN_PASSWORD, AT_LEAST_1_NUMBER_IN_PASSWORD, AT_LEAST_1_SPECIAL_CHAR_IN_PASSWORD, AT_LEAST_12_CHAR_IN_PASSWORD]}
        ${"aB2@"}              | ${[AT_LEAST_12_CHAR_IN_PASSWORD]}
        ${"X143AS+"}           | ${[AT_LEAST_1_MIN_IN_PASSWORD, AT_LEAST_12_CHAR_IN_PASSWORD]}
        ${"a143cq*"}           | ${[AT_LEAST_1_MAJ_IN_PASSWORD, AT_LEAST_12_CHAR_IN_PASSWORD]}
        ${"aBcacq%"}           | ${[AT_LEAST_1_NUMBER_IN_PASSWORD, AT_LEAST_12_CHAR_IN_PASSWORD]}
        ${"aB2"}               | ${[AT_LEAST_1_SPECIAL_CHAR_IN_PASSWORD, AT_LEAST_12_CHAR_IN_PASSWORD]}
        ${"a143cq"}            | ${[AT_LEAST_1_MAJ_IN_PASSWORD, AT_LEAST_1_SPECIAL_CHAR_IN_PASSWORD, AT_LEAST_12_CHAR_IN_PASSWORD]}
        ${"X143AS"}            | ${[AT_LEAST_1_MIN_IN_PASSWORD, AT_LEAST_1_SPECIAL_CHAR_IN_PASSWORD, AT_LEAST_12_CHAR_IN_PASSWORD]}
        ${"aBcacq"}            | ${[AT_LEAST_1_NUMBER_IN_PASSWORD, AT_LEAST_1_SPECIAL_CHAR_IN_PASSWORD, AT_LEAST_12_CHAR_IN_PASSWORD]}
        ${"(143{"}             | ${[AT_LEAST_1_MIN_IN_PASSWORD, AT_LEAST_1_MAJ_IN_PASSWORD, AT_LEAST_12_CHAR_IN_PASSWORD]}
        ${"(ARH{"}             | ${[AT_LEAST_1_MIN_IN_PASSWORD, AT_LEAST_1_NUMBER_IN_PASSWORD, AT_LEAST_12_CHAR_IN_PASSWORD]}
        ${"(akr{"}             | ${[AT_LEAST_1_MAJ_IN_PASSWORD, AT_LEAST_1_NUMBER_IN_PASSWORD, AT_LEAST_12_CHAR_IN_PASSWORD]}
        ${"asqd"}              | ${[AT_LEAST_1_MAJ_IN_PASSWORD, AT_LEAST_1_NUMBER_IN_PASSWORD, AT_LEAST_1_SPECIAL_CHAR_IN_PASSWORD, AT_LEAST_12_CHAR_IN_PASSWORD]}
        ${"AFW"}               | ${[AT_LEAST_1_MIN_IN_PASSWORD, AT_LEAST_1_NUMBER_IN_PASSWORD, AT_LEAST_1_SPECIAL_CHAR_IN_PASSWORD, AT_LEAST_12_CHAR_IN_PASSWORD]}
        ${"124153"}            | ${[AT_LEAST_1_MIN_IN_PASSWORD, AT_LEAST_1_MAJ_IN_PASSWORD, AT_LEAST_1_SPECIAL_CHAR_IN_PASSWORD, AT_LEAST_12_CHAR_IN_PASSWORD]}
        ${"#$%^&*("}           | ${[AT_LEAST_1_MIN_IN_PASSWORD, AT_LEAST_1_MAJ_IN_PASSWORD, AT_LEAST_1_NUMBER_IN_PASSWORD, AT_LEAST_12_CHAR_IN_PASSWORD]}
        ${"A22231BAH134!"}     | ${[AT_LEAST_1_MIN_IN_PASSWORD]}
        ${"A22231BAH134"}      | ${[AT_LEAST_1_MIN_IN_PASSWORD, AT_LEAST_1_SPECIAL_CHAR_IN_PASSWORD]}
        ${"12351314111451+"}   | ${[AT_LEAST_1_MIN_IN_PASSWORD, AT_LEAST_1_MAJ_IN_PASSWORD]}
        ${"AHVJVDWVASADHD+"}   | ${[AT_LEAST_1_MIN_IN_PASSWORD, AT_LEAST_1_NUMBER_IN_PASSWORD]}
        ${"12351314111451"}    | ${[AT_LEAST_1_MIN_IN_PASSWORD, AT_LEAST_1_MAJ_IN_PASSWORD, AT_LEAST_1_SPECIAL_CHAR_IN_PASSWORD]}
        ${"!@#$%^&*!@#$%^&"}   | ${[AT_LEAST_1_MIN_IN_PASSWORD, AT_LEAST_1_MAJ_IN_PASSWORD, AT_LEAST_1_NUMBER_IN_PASSWORD]}
        ${"AHVJVDWVASADHD"}    | ${[AT_LEAST_1_MIN_IN_PASSWORD, AT_LEAST_1_NUMBER_IN_PASSWORD, AT_LEAST_1_SPECIAL_CHAR_IN_PASSWORD]}
        ${"------------"}      | ${[AT_LEAST_1_MIN_IN_PASSWORD, AT_LEAST_1_MAJ_IN_PASSWORD, AT_LEAST_1_NUMBER_IN_PASSWORD]}
        ${"a22231dtaah1425+"}  | ${[AT_LEAST_1_MAJ_IN_PASSWORD]}
        ${"aadjpefjqdtaxckw+"} | ${[AT_LEAST_1_MAJ_IN_PASSWORD, AT_LEAST_1_NUMBER_IN_PASSWORD]}
        ${"a22231dtaah1425"}   | ${[AT_LEAST_1_MAJ_IN_PASSWORD, AT_LEAST_1_SPECIAL_CHAR_IN_PASSWORD]}
        ${"aadjpefjqdtaxckw"}  | ${[AT_LEAST_1_MAJ_IN_PASSWORD, AT_LEAST_1_NUMBER_IN_PASSWORD, AT_LEAST_1_SPECIAL_CHAR_IN_PASSWORD]}
        ${"aASBDHDGSIdtahxk^"} | ${[AT_LEAST_1_NUMBER_IN_PASSWORD]}
        ${"aASBDHDGSIdtahxk"}  | ${[AT_LEAST_1_NUMBER_IN_PASSWORD, AT_LEAST_1_SPECIAL_CHAR_IN_PASSWORD]}
      `("when password is filled with $password", ({ password, reasons }) => {
        const length = reasons.length;
        const join = reasons.join(", ");
        it(`should indicate ${length} violated rules: ${join}`, () => {
          const form = baseForm.fillPassword(password);
          expect(form.isValid).toBe(false);
          expect(form.reasons).toHaveLength(reasons.length);
          expect(form.reasons).toMatchObject(reasons);
        });
      });
    });
  });
  describe("mobilePhone rules", () => {
    const baseForm = validForm().clearMobilePhone();
    describe("when mobile phone is valid", () => {
      it("should indicate form is valid", () => {
        const form = baseForm.fillMobilePhone(mobilePhone);
        expect(form.isValid).toBe(true);
        expect(form.reasons).toHaveLength(0);
      });
    });
    describe("when mobile phone is invalid", () => {
      const form = baseForm.fillMobilePhone("0201020103");
      it("should indicate form is invalid", () => {
        expect(form.isValid).toBe(false);
      });
      it("should indicate that mobile phone is invalid", () => {
        expect(form.reasons).toHaveLength(1);
        expect(form.reasons).include("Numéro de téléphone mobile non valable");
      });
    });
  });
  describe("nickname rules", () => {
    const baseForm = validForm().clearNickname();
    describe("when nickname is cleared", () => {
      it("should indicate form is valid", () => {
        expect(baseForm.isValid).toBe(true);
      });
    });
    describe("when nickname is filled with empty string", () => {
      it("should indicate that nickname can't be empty", () => {
        const form = baseForm.fillNickname("");
        expect(form.isValid).toBe(false);
        expect(form.reasons).toHaveLength(1);
        expect(form.reasons).contain("Il faut renseigner un surnom");
      });
    });
  });
  describe("birthdate rules", () => {
    const baseForm = validForm().clearBirthdate();
    describe.each`
      birthdate       | valid    | reason
      ${"1949-12-25"} | ${false} | ${"Tu n'es pas si vieux !"}
      ${"3000-12-25"} | ${false} | ${"Tu ne peux pas naître dans le futur 🕵️‍♂️"}
      ${"2001-12-25"} | ${true}  | ${undefined}
    `(
      "when birthdate is filled with $birthdate",
      ({ birthdate, valid, reason }) => {
        const validity = valid ? "valid" : "invalid";
        it(`should indicate that birthdate is ${validity}`, () => {
          const form = baseForm.fillBirthdate(new Date(birthdate));
          expect(form.isValid).toBe(valid);
          if (valid) return;
          expect(form.reasons).toHaveLength(1);
          expect(form.reasons).contain(reason);
        });
      },
    );
  });
  describe("comment rules", () => {
    const baseForm = validForm().clearComment();
    describe("when comment is cleared", () => {
      it("should indicate form is valid", () => {
        expect(baseForm.isValid).toBe(true);
      });
    });
    describe("when comment is filled with empty string", () => {
      it("should indicate that comment can't be empty", () => {
        const form = baseForm.fillComment("");
        expect(form.isValid).toBe(false);
        expect(form.reasons).toHaveLength(1);
        expect(form.reasons).contain("Il faut préciser ton commentaire");
      });
    });
  });
  describe("teams rules", () => {
    const baseForm = validForm().clearTeams();
    describe.each`
      teams                          | valid
      ${[]}                          | ${true}
      ${[BDE]}                       | ${true}
      ${[HAUTS_DE_FRANCE, TECKOS]}   | ${true}
      ${[TEAM_MONTAGE, TECKOS, BDE]} | ${false}
    `("when joining $teams", ({ teams, valid }) => {
      const validity = valid ? "valid" : "invalid";
      it(`should indicate that form is ${validity}`, () => {
        const form = baseForm.fillTeams(teams);
        expect(form.isValid).toBe(valid);
        if (valid) return;
        expect(form.reasons).toMatchObject([
          "Tu ne peux pas rejoindre plus de 2 équipes",
        ]);
      });
    });
  });
  describe("EULA rules", () => {
    const form = validForm().denyEndUserLicenceAgreement();
    describe("when EULA is cleared", () => {
      it("should indicate form is invalid", () => {
        expect(form.isValid).toBe(false);
      });
    });
    it("should indicate that EULA approval is required", () => {
      expect(form.reasons).toHaveLength(1);
      expect(form.reasons).include(
        "Les Condidtions Générales d'Utilisation doivent être approuvées",
      );
    });
  });
  describe("Volunteer Charter rules", () => {
    describe("when volunteer is signing the volunteer charter", () => {
      it("should indicate form is valid", () => {
        const signedForm = validForm().signVolunteerCharter();
        expect(validForm().isValid).toBe(true);
      });
    });
    describe("when volunteer is not signing the volunteer charter", () => {
      const unsignedForm = validForm().denyVolunteerCharter();
      it("should indicate form is invalid", () => {
        expect(unsignedForm.isValid).toBe(false);
      });
      it("should indicate that signing the volunteer charter is required for volunteers", () => {
        expect(unsignedForm.reasons).toHaveLength(1);
        expect(unsignedForm.reasons).include(
          "La Charte Bénévole doit être approuvée",
        );
      });
    });
    describe("when staff is not signing the volunteer charter", () => {
      const unsignedForm = RegisterForm.initFor(STAFF)
        .fillEmail(email)
        .fillFirstname(firstname)
        .fillLastname(lastname)
        .fillPassword(password)
        .fillMobilePhone(mobilePhone)
        .fillNickname(nickname)
        .fillBirthdate(birthdate)
        .fillComment(comment)
        .fillTeams(teams)
        .approveEndUserLicenceAgreement();
      it("should indicate form is valid", () => {
        expect(unsignedForm.isValid).toBe(true);
      });
    });
  });
});
