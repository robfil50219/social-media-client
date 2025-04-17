/// <reference types="cypress" />

describe('Login only flow', () => {
  beforeEach(() => {
    // Clear any existing login state
    cy.clearLocalStorage();

    // Visit the homepage
    cy.visit('/');

    // Close the Create Profile modal if it automatically pops up
    cy.get('body').then(($body) => {
      if ($body.find('#registerModal.modal.show').length) {
        cy.get('#registerModal .btn-close').click({ force: true });
      }
    });
  });

  it('opens login modal and logs in with valid credentials', () => {
    // 1) Click the header Login button
    cy.get('header .text-end button[data-auth="login"]')
      .first()
      .click({ force: true });

    // 2) Verify the login modal is displayed
    cy.get('#loginModal').should('have.class', 'show');

    // 3) Fill in credentials (force to bypass any overlap)
    cy.get('#loginModal input#loginEmail').type(Cypress.env('VALID_EMAIL'), {
      force: true,
    });
    cy.get('#loginModal input#loginPassword').type(
      Cypress.env('VALID_PASSWORD'),
      { force: true }
    );

    // 4) Submit the login form
    cy.get('#loginForm button[type="submit"]').click({ force: true });

    // 5) Verify successful login by checking URL and logout button
    cy.url().should('include', '?view=profile');
    cy.get('button[data-auth="logout"]').should('be.visible');
  });
});
