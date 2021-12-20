/* eslint-disable no-alert */

import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { Promise } from 'rsvp';
import { later } from '@ember/runloop';

export default class ApplicationController extends Controller {
  @tracked isEscapable = false;
  @tracked clickOutsideToEscape = true;
  @tracked loadDelay = false;
  @tracked confirmEscape = false;
  @tracked escapeOnFocusLeave = false;
  @tracked showExampleModal = false;

  openExampleModal = () => {
    this.showExampleModal = true;
  };

  closeExampleModal = () => {
    this.showExampleModal = false;
  };

  resetClickOutsideToEscape = () => {
    this.clickOutsideToEscape = true;
  };

  handleEscapeExampleModal = (modal, event) => {
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
  };

  loadExampleModal = () => {
    if (!this.loadDelay) {
      return;
    }

    return new Promise((resolve) => {
      later(resolve, 2000);
    });
  };
}
