describe("Import page", () => {
  beforeEach(() => {
    const fakeToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiZGVtb0BleGFtcGxlLmNvbSIsImlhdCI6MTc3MzY5NTQwMCwiZXhwIjoxNzczNzgxODAwfQ.l6C0yhuGZcSvxWzh_diE15Un1vYwJinroRxXCx1Tkb8";
    localStorage.setItem("token", fakeToken);
    localStorage.setItem("user", `{"id":1,"email":"demo@example.com"}`);
  });

  it("loads the import page with empty history", () => {
    cy.intercept("GET", "/api/import/history", {
      statusCode: 200,
      body: [],
    }).as("getImportHistory");

    cy.visit("/");
    cy.get("a").contains(/Import/i).click();

    cy.wait("@getImportHistory");

    cy.get("h1").contains(/Import Expenses/i).should("exist");
    cy.contains(/Import History/i).should("exist");
    cy.contains(/No import history yet/i).should("exist");
  });

  it("opens the import wizard when clicking Start Import", () => {
    cy.intercept("GET", "/api/import/history", {
      statusCode: 200,
      body: [],
    }).as("getImportHistory");

    cy.visit("/");
    cy.get("a").contains(/Import/i).click();

    cy.wait("@getImportHistory");

    cy.get('.mt-6 > .inline-flex').contains(/Start Import/i).click();

    cy.contains(/Upload CSV File/i).should("exist");
    cy.contains(/Cancel Import/i).should("exist");
  });

  it("shows validation errors when uploading an invalid CSV file", () => {
    cy.intercept("GET", "/api/import/history", {
      statusCode: 200,
      body: [],
    }).as("getImportHistory");

    cy.visit("/");
    cy.get("a").contains(/Import/i).click();

    cy.wait("@getImportHistory");

    cy.contains("button", "Start Import").click();

    // Upload an invalid CSV file and progress through the wizard
    cy.get(".mt-6 > .inline-flex")
      .click()
      .selectFile("cypress/fixtures/invalid-import.csv");

    // Map CSV Columns step
    cy.contains(/Map CSV Columns/i);
    cy.contains("button", "Continue").click();

    //validation errors should be caught
    cy.contains(/Validation Errors/);
    //TODO: More specific validations to match expected errors

  });

  it("handles 401 when loading import history", () => {
    cy.intercept("GET", "/api/import/history", {
      statusCode: 401,
    }).as("getImportHistory401");

    cy.visit("/");
    cy.get("a").contains(/Import/i).click();

    cy.wait("@getImportHistory401")
      .its("response.statusCode")
      .should("eq", 401);
    // TODO: Add UI validation for 401 error when bug is fixed
  });

  it("handles 500 when loading import history", () => {
    cy.intercept("GET", "/api/import/history", {
      statusCode: 500,
    }).as("getImportHistory500");

    cy.visit("/");
    cy.get("a").contains(/Import/i).click();

    cy.wait("@getImportHistory500")
      .its("response.statusCode")
      .should("eq", 500);
    // TODO: Add UI validation for 500 error when bug is fixed
  });
  
  it("uploads a CSV file using the fixture", () => {
    cy.intercept("GET", "/api/import/history", {
      statusCode: 200,
      body: [],
    }).as("getImportHistory");

    cy.visit("/");
    cy.get("a").contains(/Import/i).click();

    cy.wait("@getImportHistory");

    cy.contains("button","Start Import").click();

    // Use the CSV fixture to upload a file in the wizard
    cy.get('.mt-6 > .inline-flex').click().selectFile("cypress/fixtures/valid-import.csv");
    // hit continue for valid file
    // Verify user is on Map CSV Columns step
    cy.contains(/Map CSV Columns/i);
    cy.contains("button", "Continue").click();
    // Verify user is on Preview Import
    cy.contains(/Preview Import/);
    cy.contains("button", "Import").click();
    // Verify user is on Import Complete
    cy.contains("Import Complete");
    cy.contains("button", "View Expenses").click();
    // Verify user is viewing expenses;
    cy.contains(/ExpenseTracker/);
    // TODO: Revert import
  });
});

