import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  @tracked isEscapable = false;
  @tracked loadDelay = false;
  @tracked showExampleModal = false;

  @action
  openExampleModal() {
    this.showExampleModal = true;
  }

  @action
  closeExampleModal() {
    this.showExampleModal = false;
  }

  @action
  setEscapable(event) {
    this.isEscapable = event.target.checked;
  }

  @action
  loadExampleModal() {
    if (!this.loadDelay) {
      return;
    }

    return new Promise((resolve) => setTimeout(resolve, 2000));
  }
}
