/// <reference types='cypress' />
/// <reference types='../support' />

import HomePageObject from '../support/pages/home.pageObject';
import SignInPageObject from '../support/pages/signIn.pageObject';
import SettingsPageObject from '../support/pages/settings.pageObject';
import { faker } from '@faker-js/faker';

const signInPage = new SignInPageObject();
const homePage = new HomePageObject();
const settingsPage = new SettingsPageObject();

describe('Settings page', () => {
  let user;

  beforeEach(() => {
    cy.task('db:clear');
    cy.task('generateUser').then((generatedUser) => {
      user = generatedUser;

      signInPage.visit();
      cy.register(user.email, user.username, user.password);

      signInPage.typeEmail(user.email);
      signInPage.typePassword(user.password);
      signInPage.clickSignInBtn();
    });
  });

  const openSettings = () => {
    homePage.usernameLink.click();
    cy.get('[data-qa=edit-profile-settings-link]').click();
  };

  it('should provide an ability to log in with existing credentials', () => {
    homePage.assertHeaderContainUsername(user.username);
  });

  it('should provide an ability to update username', () => {
    openSettings();

    const newUsername = user.username + faker.string.alpha(3);

    cy.intercept('PUT', '**/api/user').as('updateUser');

    settingsPage.typeUsername(newUsername);
    settingsPage.clickUpdateSettingsBtn();

    cy.wait('@updateUser').its('response.statusCode').should('eq', 200);

    homePage.visit();
    cy.get('[data-qa=username-link]').should('contain.text', newUsername);
  });

  it('should provide an ability to update bio', () => {
    openSettings();

    const randomBio = faker.lorem.sentence();

    cy.intercept('PUT', '**/api/user').as('updateUser');

    settingsPage.typeBio(randomBio);
    settingsPage.clickUpdateSettingsBtn();

    cy.wait('@updateUser').its('response.statusCode').should('eq', 200);

    cy.visit('/#/settings');
    cy.get('[data-qa=settings-bio-textarea]').should('have.value', randomBio);
  });

  it('should provide an ability to update email', () => {
    openSettings();

    const newEmail = faker.internet.email();

    cy.intercept('PUT', '**/api/user').as('updateUser');

    settingsPage.typeEmail(newEmail);
    settingsPage.clickUpdateSettingsBtn();

    cy.wait('@updateUser').its('response.statusCode').should('eq', 200);

    cy.visit('/#/settings');
    cy.get('[data-qa=settings-email-input]').should('have.value', newEmail);
  });

  it('should provide an ability to update password', () => {
    openSettings();

    const newPassword = faker.internet.password({ length: 12 });

    cy.intercept('PUT', '**/api/user').as('updateUser');

    settingsPage.typePassword(newPassword);
    settingsPage.clickUpdateSettingsBtn();

    cy.wait('@updateUser').its('response.statusCode').should('eq', 200);

    settingsPage.clickLogoutBtn();

    signInPage.typeEmail(user.email);
    signInPage.typePassword(newPassword);
    signInPage.clickSignInBtn();

    homePage.assertHeaderContainUsername(user.username);
  });

  it('should provide an ability to log out', () => {
    openSettings();

    cy.get('[data-qa=logout-button]').click();

    homePage.usernameLink.should('not.exist');
  });
});
