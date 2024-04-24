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

    cy.get('[data-cy="profile-sign-out-button"]').click();
  });

  it("displays correct text and sign-in button when user is not signed in", () => {
    cy.contains("You are not signed in!");
    cy.contains("To view this page you must be signed in.");
    cy.get('[data-cy="profile-sign-in-button"]').should("be.visible");
  });
});
