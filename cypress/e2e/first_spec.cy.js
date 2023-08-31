describe('Input Validation', () => {
  beforeEach(() => {
    cy.visit('localhost:3000'); // Replace with your actual website URL
  });

  it('should show error messages for missing parameters', () => {
    cy.get('#button-calculate').click();

    cy.get('#span-wrong-input').should('be.visible');
  });

  it('should show error messages for missing email and checkbox', () => {
    cy.get('#input-email').clear();
    cy.get('#button-email').click();

    cy.get('#email-error').should('be.visible');
    cy.get('#checkbox-error').should('be.visible');
  });

  // Add more test cases as needed
});

describe('Map Interactions', () => {
  beforeEach(() => {
    cy.visit('localhost:3000'); // Replace with your actual website URL
  });

  it('should add a marker on the map', () => {
    // Mocking map interaction by triggering a click event
    cy.get('#map').trigger('click', { clientX: 200, clientY: 200 });

    cy.get('.leaflet-marker-icon').should('have.length', 1);
  });

  it('should display latitude and longitude on marker click', () => {
    // Mocking map interaction by triggering a click event
    cy.get('#map').trigger('click', { clientX: 200, clientY: 200 });

    // cy.get('.leaflet-marker-icon').first().click();

    cy.get('#map-lat').should('be.visible');
    cy.get('#map-lng').should('be.visible');
  });

  // Add more test cases as needed
});

describe('API Calls', () => {
  it('should successfully mock an API call', () => {
    cy.intercept('POST', 'http://api-rce.azurewebsites.net:80/api/estimate', {
      statusCode: 200,
      body: {
        // Replace with your mocked response data
      },
    }).as('estimateMock');

    cy.visit('http://localhost:3000'); // Replace with your web app's URL

    // Perform actions that trigger the API call
    cy.get('#input-power').type('100'); // Enter a value in the input with id="input-power"
    cy.get('#map').click(50, 50); // Click a point on the map with id="map"
    cy.get('#button-calculate').click(); // Click the button with id="button-calculate"

    cy.wait('@estimateMock', { timeout: 15000 }).should(({ request, response }) => {
      expect(request.method).to.equal('POST');
      expect(response.statusCode).to.equal(200);
      // Add more assertions on response data if needed
    });
  });

  // Add more test cases for other API calls if needed
});