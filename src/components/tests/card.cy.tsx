import { mount } from "cypress/react18";
import MyCard from "../card";
import { Property } from "../property-info";
import { format, parseISO } from "date-fns";

describe("MyCard component", () => {
  let formattedDateFrom: string;
  let formattedDateTo: string;

  // Load property data from a JSON file before each test
  beforeEach(() => {
    cy.fixture("property").then((property: Property) => {
      // Format the dates once here, so it can be used in multiple tests
      formattedDateFrom = format(parseISO(property.dateFrom), "dd MMM yy");
      formattedDateTo = format(parseISO(property.dateTo), "dd MMM yy");
      mount(<MyCard property={property} setBookmarkedProperties={() => {}} />);
    });
  });

  it("renders MyCard component with correct data", () => {
    // Check if the property address is displayed correctly
    cy.get('[data-cy="address-text"]').should(
      "contain",
      "123 Broadway, New York"
    );
    // Check if the swap city is displayed correctly
    cy.get('[data-cy="swap-city"]').should("contain", "San Francisco");

    // Assert that the dates are displayed in the correct format
    cy.get('[data-cy="date-from"]').should("contain", formattedDateFrom);
    cy.get('[data-cy="date-to"]').should("contain", formattedDateTo);
  });

  it("handles bookmark click", () => {
    // Check initial state of the bookmark button (unbookmarked)
    cy.get('[data-cy="bookmark-button"]').should(
      "have.attr",
      "data-bookmarked",
      "false"
    );

    // Simulate a click to bookmark the property
    cy.get('[data-cy="bookmark-button"]').click();
    // Verify that the data-bookmarked attribute is true
    cy.get('[data-cy="bookmark-button"]').should(
      "have.attr",
      "data-bookmarked",
      "true"
    );

    // Simulate another click to unbookmark the property
    cy.get('[data-cy="bookmark-button"]').click();
    // Verify that the data-bookmarked attribute is false
    cy.get('[data-cy="bookmark-button"]').should(
      "have.attr",
      "data-bookmarked",
      "false"
    );
  });
});
