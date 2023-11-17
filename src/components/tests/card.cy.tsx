import React from "react";
import MyCard from "../card";

describe("<MyCard />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.fixture("property.json")
      .as("mockProperty")
      .then((mockProperty) => {
        cy.mount(
          <MyCard
            property={mockProperty}
            setBookmarkedProperties={(bookmarks) => console.log(bookmarks)}
          />
        );
        cy.get("[data-cy=address-text]").contains("New York");
      });
  });
});
