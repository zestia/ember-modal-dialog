import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { Promise } from 'rsvp';
import { later } from '@ember/runloop';

export default class ApplicationController extends Controller {
  testModalIsEscapable = false;
  testModalLoadDelay = false;
  @tracked showTestModal = false;
  @tracked showMoreContent = false;

  @action
  openTestModal() {
    this.showTestModal = true;
  }

  @action
  closeTestModal() {
    this.showTestModal = false;
    this.showMoreContent = false;
  }

  @action
  addMoreContent() {
    this.showMoreContent = true;
  }

  @action
  loadTestModal() {
    if (!this.testModalLoadDelay) {
      return;
    }

    return new Promise((resolve) => {
      later(resolve, 2000);
    });
  }
}
