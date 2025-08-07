/// <reference types='cypress' />
/// <reference types='../support' />

import SignInPageObject from '../support/pages/signIn.pageObject';

const signInPage = new SignInPageObject();

describe('User', () => {
  let userTarget;
  let userFollower;

  before(() => {
    cy.task('db:clear');

    cy.task('generateUser').then((target) => {
      userTarget = target;
      cy.register(userTarget.email, userTarget.username, userTarget.password);
    });

    cy.task('generateUser').then((follower) => {
      userFollower = follower;
      // eslint-disable-next-line max-len
      cy.register(userFollower.email, userFollower.username, userFollower.password);
    });
  });

  it('should be able to follow and unfollow another user', () => {
    signInPage.visit();

    cy.intercept('POST', `**/api/profiles/${userTarget.username}/follow`).as('followUser');
    cy.intercept('DELETE', `**/api/profiles/${userTarget.username}/follow`).as('unfollowUser');
    cy.intercept('GET', '**/api/articles/feed*').as('getFeed');

    signInPage.typeEmail(userFollower.email);
    signInPage.typePassword(userFollower.password);
    signInPage.clickSignInBtn();

    cy.wait('@getFeed');

    cy.visit(`/#/@${userTarget.username}`);

    cy.contains('button', `Follow ${userTarget.username}`).click();
    cy.wait('@followUser');
    cy.contains('button', `Unfollow ${userTarget.username}`).should('be.visible');

    cy.contains('button', `Unfollow ${userTarget.username}`).click();
    cy.wait('@unfollowUser');
    cy.contains('button', `Follow ${userTarget.username}`).should('be.visible');
  });
});
