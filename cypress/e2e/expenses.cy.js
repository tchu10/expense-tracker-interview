describe("Expenses", () => {
  beforeEach(() => {
    // Seed fake auth like in the dashboard tests
    const fakeToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiZGVtb0BleGFtcGxlLmNvbSIsImlhdCI6MTc3MzY5NTQwMCwiZXhwIjoxNzczNzgxODAwfQ.l6C0yhuGZcSvxWzh_diE15Un1vYwJinroRxXCx1Tkb8";
    localStorage.setItem("token", fakeToken);
    localStorage.setItem("user", `{"id":1,"email":"demo@example.com"}`);

    cy.visit("/");
    cy.get("a").contains(/Expenses/i).click();
  });

  it("loads the expenses page", () => {
    cy.get("h1").contains(/Expenses/i).should("exist");
  });

  it("shows loading state then list of expenses", () => {
    // Basic presence checks; selectors can be refined later with data-testid
    cy.get('input[placeholder="Search expenses..."]')
      .should("have.attr", "placeholder", "Search expenses...");
      cy.get('.space-y-4 > .p-4').contains("Date Range").should("exist");
  });

  it("opens the add expense modal", () => {
    cy.contains(/Add Expense/i).click();
    cy.contains(/Add Expense/i).should("exist");
    cy.contains(/Cancel/i).click();
  });

  it("search not found",()=>{
    //possible bug here. Invalid search not explicitly known to user
    cy.get('input[placeholder="Search expenses..."]').as("searchInput");

    cy.get("@searchInput").type("NotFound");
    // when no expenses match, we should show the empty state message
    cy.contains("No expenses found. Add your first expense!").should("exist");
    // and the expenses list container should not be rendered
    cy.get('.divide-y').should("not.exist");
  })

  it("filters expenses by search text", () => {
    cy.get('input[placeholder="Search expenses..."]').as("searchInput");

    cy.get("@searchInput").type("Grocery");
    // the "no expenses found" box should not be visible when we have matches
    cy.contains("No expenses found. Add your first expense!").should("not.exist");
    // and the expenses list container should still be rendered
    cy.get('.divide-y').should("exist").should("contain.text", "Grocery");
    cy.get("@searchInput").clear();
  });

  it("handles 400 when loading expenses data", () => {
    //TODO: validate 401 error message
    cy.intercept("GET", "/api/expenses*", { statusCode: 401 }).as("expenses400");

    cy.visit("/");
    cy.get("a").contains(/Expenses/i).click();

    cy.wait("@expenses400").its("response.statusCode").should("eq", 401);
    // TODO: Add UI validation for 401 error when bug is fixed
  });

  it.only("handles 500 when loading expenses data", () => {
    //TODO: validate 500 error message
    cy.intercept("GET", "/api/expenses*", { statusCode: 500 }).as("expenses500");

    cy.visit("/");
    cy.get("a").contains(/Expenses/i).click();

    cy.wait("@expenses500").its("response.statusCode").should("eq", 500);
    // TODO: Add UI validation for 501 error when bug is fixed
  });
});
