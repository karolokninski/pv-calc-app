describe("PV Calculator Test", () => {
  it("should perform the required actions", () => {
    cy.visit("http://localhost:3000");

    cy.get("#input-power").type("5.0"); // Enter a value between 0.01 and 10
    cy.get("#input-angle").invoke("val", "40").trigger("change"); // Set the angle value
    cy.get("#input-select-azimuth").select("30"); // Select an option from the dropdown
    cy.get("#map").click(); // Click on the map
    cy.get("#button-calculate").click(); // Click the calculate button

    cy.wait(10000); // Wait for 10 seconds

    cy.get("#plot").should("be.visible"); // Check if the plot is visible
    cy.get("#plot-cumulative").should("be.visible"); // Check if the cumulative plot is visible
    cy.get("#heatmap-production").should("be.visible"); // Check if the production heatmap is visible
    cy.get("#heatmap-profit").should("be.visible"); // Check if the profit heatmap is visible
  });
});
