import PageObject from '../PageObject';

class ArticlePageObject extends PageObject {
  url = '/#/editor';

  get titleField() {
    return cy.get('[data-qa=article-title-input]');
  }

  get aboutField() {
    return cy.get('[data-qa=article-about-input]');
  }

  get textField() {
    return cy.get('[data-qa=article-body-textarea]');
  }

  get tagsField() {
    return cy.get('[data-qa=article-tags-input]');
  }

  get publishArticleBtn() {
    return cy.get('[data-qa=publish-article-button]');
  }

  get editArticleBtn() {
    return cy.get('[data-qa=edit-article-button]');
  }

  get deleteArticleBtn() {
    return cy.get('[data-qa=delete-article-button]');
  }

  get newArticleBtn() {
    return cy.get('[data-qa=new-article-button]');
  }

  get noArticlesMessage() {
    return cy.get('[data-qa=no-articles-message]');
  }

  typeTitle(title) {
    this.titleField.clear().type(title);
  }

  typeAbout(about) {
    this.aboutField.clear().type(about);
  }

  typeText(text) {
    this.textField.clear().type(text);
  }

  typeTag(tag) {
    this.tagsField.clear().type(`${tag}{Enter}`);
  }

  clickPublishArticleBtn() {
    this.publishArticleBtn.click();
  }

  clickEditArticleBtn() {
    this.editArticleBtn.click();
  }

  clickDeleteArticleBtn() {
    this.deleteArticleBtn.click();
  }

  clickNewArticleBtn() {
    this.newArticleBtn.click();
  }
}

export default ArticlePageObject;
