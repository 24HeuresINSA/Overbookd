// user.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

describe("User lifecycle", () => {
  it("signup user", () => {
    cy.visit("http://localhost:3000/login");
    cy.contains("signup").click();
    cy.url().should("include", "signup");

    // fill in form
    cy.get("[id=input-19]").type("test");
    cy.get("[id=input-23]").type("user");

    cy.get("[id=input-31]").type("user.test1");
    cy.get("[id=input-35]").type("user.test1");

    cy.get("[id=input-65]").type("user.test@gmail.com");
  });

  it("login user and create FA", () => {
    cy.visit("http://localhost:3000/login");

    cy.get("[id=input-20]").type("hugo.courte");
    cy.get("[id=input-23]").type("jesuistropcon");

    cy.contains("login").click();

    cy.contains("Bonsoir hugo");

    cy.visit("http://localhost:3000/fa");
    cy.contains("Fiche Anim 🎉");

    cy.visit("http://localhost:3000/fa/newFA");
    cy.get("[id=input-81]").type("FA test");

    cy.get(
      "#app > div > main > div > div > div > div.v-data-table.v-data-table--has-top.v-data-table--has-bottom.theme--light > header > div > button"
    ).click();

    cy.get("#input-234").type("5");
    cy.get(
      "#app > div.v-dialog__content.v-dialog__content--active > div > div > div.v-card__actions > button"
    ).click();

    cy.get(
      "#app > div.v-application--wrap > main > div > div > div > div:nth-child(20) > button.fab.v-btn.v-btn--is-elevated.v-btn--has-bg.theme--light.v-size--default.primary"
    ).click();

    // FA saved
    cy.visit("http://localhost:3000/fa");
    cy.contains("FA test");

    cy.visit("http://localhost:3000/fa/FA%20test");
    cy.get(
      "#app > div > main > div > div > div > div:nth-child(20) > button:nth-child(2)"
    ).click();
    cy.get(
      "#app > div.v-dialog__content.v-dialog__content--active > div > div > div.v-card__actions > button"
    ).click();

    cy.contains("submitted");
    // FA submitted
  });

  it("validate FA as secu", () => {
    cy.visit("http://localhost:3000/login");

    cy.get("[id=input-20]").type("corentin.mammi");
    cy.get("[id=input-23]").type("123456789{enter}");

    cy.visit("http://localhost:3000/fa/FA%20test");
    cy.wait(1000);

    cy.get(
      "#app > div > main > div > div > div > div:nth-child(20) > button:nth-child(3)"
    ).click(); // validated
  });

  it("refuse FA as log", () => {
    cy.visit("http://localhost:3000/login");

    cy.get("[id=input-20]").type("hugo.courte");
    cy.get("[id=input-23]").type("jesuistropcon{enter}");

    cy.visit("http://localhost:3000/fa/FA%20test");
    cy.wait(1000);

    cy.get(
      "#app > div > main > div > div > div > div:nth-child(20) > button.fab.v-btn.v-btn--is-elevated.v-btn--has-bg.theme--light.v-size--default.red"
    ).click();
    cy.get("#input-229").type("refuse by bot");

    cy.get(
      "#app > div.v-dialog__content.v-dialog__content--active > div > div > div.v-card__actions > button"
    ).click();
  });

  it("accept FA as humain", () => {
    cy.visit("http://localhost:3000/login");

    cy.get("[id=input-20]").type("alexis.borel");
    cy.get("[id=input-23]").type("mot de passe{enter}");

    cy.visit("http://localhost:3000/fa/FA%20test");
    cy.wait(1000);

    cy.get(
      "#app > div > main > div > div > div > div:nth-child(20) > button:nth-child(3)"
    ).click();
  });

  it("fix FA equipments", () => {
    cy.visit("http://localhost:3000/login");

    cy.get("[id=input-20]").type("hugo.courte");
    cy.get("[id=input-23]").type("jesuistropcon");

    cy.contains("login").click();

    cy.contains("Bonsoir hugo");

    cy.visit("http://localhost:3000/fa");
    cy.contains("Fiche Anim 🎉");

    cy.visit("http://localhost:3000/fa/FA%20test");

    cy.get(
      "#app > div > main > div > div > div > div.v-data-table.v-data-table--has-top.v-data-table--has-bottom.theme--light > header > div > button"
    ).click();

    cy.get("#input-246").type("3");
    cy.get(
      "#app > div.v-dialog__content.v-dialog__content--active > div > div > div.v-card__actions > button"
    ).click();

    cy.get(
      "#app > div.v-application--wrap > main > div > div > div > div:nth-child(20) > button.fab.v-btn.v-btn--is-elevated.v-btn--has-bg.theme--light.v-size--default.primary"
    ).click();

    // FA saved
    cy.visit("http://localhost:3000/fa");
    cy.contains("FA test");

    cy.wait(1000);
    cy.get(
      "#app > div.v-dialog__content.v-dialog__content--active > div > div > div.v-card__actions > button"
    ).click();

    cy.contains("submitted");
    // FA submitted
  });

  it("accept FA as log", () => {
    cy.visit("http://localhost:3000/login");

    cy.get("[id=input-20]").type("hugo.courte");
    cy.get("[id=input-23]").type("jesuistropcon{enter}");

    cy.visit("http://localhost:3000/fa/FA%20test");
    cy.wait(1000);

    cy.visit("http://localhost:3000/fa/FA%20test");
    cy.wait(1000);

    cy.get(
      "#app > div > main > div > div > div > div:nth-child(20) > button:nth-child(3)"
    ).click();

    cy.visit("http://localhost:3000/fa/FA%20test");
    cy.contains("validated");
  });
});
