/* eslint-disable no-alert */

import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { later } from '@ember/runloop';

export default class ApplicationController extends Controller {
  @tracked isEscapable = false;
  @tracked clickOutsideToEscape = true;
  @tracked loadDelay = false;
  @tracked confirmEscape = false;
  @tracked escapeOnFocusLeave = false;
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
  resetClickOutsideToEscape() {
    this.clickOutsideToEscape = true;
  }

  @action
  handleEscapeExampleModal(modal, event) {
    const escapable =
      this.isEscapable &&
      ((this.clickOutsideToEscape && event instanceof MouseEvent) ||
        event instanceof KeyboardEvent);

    if (!escapable) {
      return;
    }

    let close = true;

    if (this.confirmEscape) {
      close = confirm('Are you sure?');
    }

    if (close) {
      modal.close();
    }
  }

  @action
  loadExampleModal() {
    if (!this.loadDelay) {
      return;
    }

    return new Promise((resolve) => {
      later(resolve, 2000);
    });
  }
}
