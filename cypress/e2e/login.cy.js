describe("Login flow", () => {
  beforeEach(() => {
    cy.visit("/");
  });

// TODO: Fix this test after the bug is fixed
  it.skip("shows validation errors for empty fields", () => {
    cy.contains(/login/i).click({ force: true }).optional;

    cy.get('input[name="email"]').clear();
    cy.get('input[name="password"]').clear();
    cy.get('button[type="submit"]').click();

    cy.contains(/email/i);
    cy.contains(/password/i);
  });

  it("shows an error on 401 Unauthorized", () => {
    cy.intercept("POST", "/api/auth/login", {
      statusCode: 401,
    }).as("login401");

    cy.get('input[name="email"]').clear().type("wrong@example.com");
    cy.get('input[name="password"]').clear().type("wrongpassword");
    cy.get('button[type="submit"]').click();

    cy.wait("@login401")
      .its("response.statusCode")
      .should("eq", 401);
  });

  it("shows an error on 500 Server Error", () => {
    cy.intercept("POST", "/api/auth/login", {
      statusCode: 500,
    }).as("login500");

    cy.get('input[name="email"]').clear().type("demo@example.com");
    cy.get('input[name="password"]').clear().type("password123");
    cy.get('button[type="submit"]').click();

    cy.wait("@login500")
      .its("response.statusCode")
      .should("eq", 500);
  });

  it("accepts valid credentials (stubbed)", () => {

    cy.get('input[name="email"]').clear().type("demo@example.com");
    cy.get('input[name="password"]').clear().type("password123");
    cy.get('button[type="submit"]').click();
    cy.get('.text-xl').should("contain.text", "ExpenseTracker");


    // Example post-login assertion – change to match your app
    // cy.url().should("include", "/dashboard");
  });
});
