import React from "react";

describe("Search Button", () => {
  before(() => {
    cy.visit("http://localhost:3000/home");
  });

  it("should fill out and apply filters", () => {
    cy.fixture("search.json").then((searchData) => {
      cy.get('[data-cy="search-button"]').click();

      cy.get('[data-cy="city-input"]').type(searchData.city);
      cy.get('[data-cy="hometown-input"]').type(searchData.hometown);

      cy.get('[data-cy="dateFrom-input"]').type(searchData.dateFrom);
      cy.get('[data-cy="dateTo-input"]').type(searchData.dateTo);

      cy.get('[data-cy="submit-button"]').click();

      cy.contains("Filter applied.").should("be.visible");
      cy.get('[data-cy="filters-applied-tag"]').should("be.visible");
    });
  });
});
