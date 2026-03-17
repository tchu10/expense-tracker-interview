describe("Dashboard", () => {
  beforeEach(() => {
    // If your app requires auth to see the dashboard,
    // you can either:
    // - log in via the UI here, or
    // - set auth state directly (e.g. localStorage) before visiting.
    //
    // For now we assume the dashboard is at /dashboard.
    //cy.visit("/dashboard");
    //click on dashboard link
    const fakeToken = "fake-token";
    localStorage.setItem("token", `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiZGVtb0BleGFtcGxlLmNvbSIsImlhdCI6MTc3MzY5NTQwMCwiZXhwIjoxNzczNzgxODAwfQ.l6C0yhuGZcSvxWzh_diE15Un1vYwJinroRxXCx1Tkb8`);
    localStorage.setItem("user", `{"id":1,"email":"demo@example.com"}`);
    cy.visit("/");
    cy.get('.hidden > .text-indigo-600').should("contain.text", "Dashboard").click();
  });

  it("loads the dashboard page", () => {
    cy.get('.text-2xl').should("contain.text", "Dashboard");
  });

  it("shows key dashboard elements", () => {
    // Adjust selectors/text to match your real UI
    // check for spending, total expenses, avg per expense, recent expenses
    //TODO: add more specific selectors once datatestids are implemented

    cy.contains(/Spending/i);
    cy.contains(/Total Expenses/i);
    cy.contains(/Avg per Expense/i);
    cy.contains(/Recent Expenses/i);
  });

  it("Verify navigation links and buttons", () => {
    // Example: navigation links or buttons
    // Update selectors/text to match your app
    // verify that Expenses, Import, and Logout links are present
    cy.get("a").contains(/Expenses/i).should("exist");
    cy.get("a").contains(/Import/i).should("exist");
    cy.get("button").contains(/Logout/i).should("exist");
  });

  it("handles 401 when loading dashboard data", () => {
    cy.intercept("GET", "/api/expenses*", { statusCode: 401 }).as("expenses401");
    cy.intercept("GET", "/api/expenses/monthly-total*", { statusCode: 401 }).as("monthlyTotal401");

    cy.visit("/");
    cy.get('.hidden > .text-indigo-600').contains("Dashboard").click();

    cy.wait("@expenses401").its("response.statusCode").should("eq", 401);
    cy.wait("@monthlyTotal401").its("response.statusCode").should("eq", 401);
    //TODO: Add validation when bug is fixed
  });

  it("handles 500 when loading dashboard data", () => {
    cy.intercept("GET", "/api/expenses*", { statusCode: 500 }).as("expenses500");
    cy.intercept("GET", "/api/expenses/monthly-total*", { statusCode: 500 }).as("monthlyTotal500");

    cy.visit("/");
    cy.get('.hidden > .text-indigo-600').contains("Dashboard").click();

    cy.wait("@expenses500").its("response.statusCode").should("eq", 500);
    cy.wait("@monthlyTotal500").its("response.statusCode").should("eq", 500);
    //TODO: Add validation for 500 error when bug is fixed
  });

  it.only("logs out and clears auth state", () => {
    // Click the Logout button
    cy.get("button").contains(/Logout/i).click();

    // Verify token and user are cleared from localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem("token")).to.be.null;
      expect(win.localStorage.getItem("user")).to.be.null;
    });

    // Optionally, verify we are back on the login screen
    cy.get('.mt-6').contains("Sign in to your account")
  });

});
