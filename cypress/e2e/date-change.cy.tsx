import React from "react";

describe("Edit button", () => {
  //login in before each test
  beforeEach(() => {
    cy.visit("http://localhost:3000/profile");
    cy.get('[data-cy="profile-sign-in-button"]').click();

    cy.get("input[name=identifier]").type("amandaht99+3@gmail.com");

    cy.focused().type("{enter}");

    cy.get("input[name=password]").type("roomy3456");

    cy.focused().type("{enter}");

    cy.visit("http://localhost:3000/profile");
  });

  it("should change begin date", () => {
    cy.fixture("date.json").then((date) => {
      cy.get('[data-cy="dateFrom-edit-button"]').click();

      cy.get('[data-cy="dateFrom-input"]').type(date.dateFrom);

      cy.get('[data-cy="dateFrom-submit-button"]').click();

      cy.contains("Changes applied.").should("be.visible");
    });
  });

  it("should change end date", () => {
    cy.fixture("date.json").then((date) => {
      cy.get('[data-cy="dateTo-edit-button"]').click();

      cy.get('[data-cy="dateTo-input"]').type(date.dateTo);

      cy.get('[data-cy="dateTo-submit-button"]').click();

      cy.contains("Changes applied.").should("be.visible");
    });
  });
});
