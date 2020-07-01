import Component from '@glimmer/component';
import { Promise, resolve } from 'rsvp';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

export default class ModalDialogComponent extends Component {
  element = null;

  @tracked isLoading = false;
  @tracked isShowing = true;
  @tracked isWarning = false;

  constructor() {
    super(...arguments);
    this._load();
  }

  get api() {
    return {
      close: this.close
    };
  }

  get rootElement() {
    return document.querySelector(':root');
  }

  get focusableElements() {
    return [
      ...this.element.querySelectorAll(
        'a, button, textarea, input, select, [tabindex="0"]'
      )
    ].filter((element) => !element.disabled);
  }

  get firstFocusableElement() {
    return this.focusableElements[0];
  }

  get lastFocusableElement() {
    return this.focusableElements[this.focusableElements.length - 1];
  }

  @action
  close() {
    return this._hide().then(() => this._invokeAction('onClose'));
  }

  @action
  warn() {
    this.isWarning = true;

    this._waitForAnimation().then(() => (this.isWarning = false));
  }

  @action
  handleKeydown(e) {
    if (this._pressedEscape(e)) {
      this._attemptEscape();
    } else if (this._pressedTab(e)) {
      this._trapFocus(e);
    }
  }

  @action
  handleClick(e) {
    if (e.target === this.element) {
      this._attemptEscape();
    }
  }

  @action
  handleInsertElement(element) {
    this.element = element;
    this.element.focus();
    this.rootElement.classList.add('has-modal');
    this._disableBodyScroll();
    this._ready();
  }

  @action
  handleDestroyElement() {
    this._enableBodyScroll();
    this.rootElement.classList.remove('has-modal');
  }

  _ready() {
    this._invokeAction('onReady', this.api);
  }

  _load() {
    this.isLoading = true;

    resolve(this._invokeAction('onLoad'))
      .then((data) => this._invokeAction('onLoaded', data))
      .catch((error) => this._invokeAction('onLoadError', error))
      .finally(() => (this.isLoading = false));
  }

  _hide() {
    this.isShowing = false;

    return this._waitForAnimation();
  }

  _disableBodyScroll() {
    disableBodyScroll(this.element, {
      reserveScrollBarGap: true,
      allowTouchMove: this._allowTouchMove.bind(this)
    });
  }

  _enableBodyScroll() {
    enableBodyScroll(this.element);
  }

  _allowTouchMove(element) {
    return this.boxElement.contains(element);
  }

  _waitForAnimation() {
    return new Promise((resolve) => {
      this.element.addEventListener('animationend', resolve, {
        once: true
      });
    });
  }

  _pressedEscape(e) {
    return e.keyCode === 27;
  }

  _pressedTab(e) {
    return e.keyCode === 9;
  }

  _tabbedToEnd(e) {
    return !e.shiftKey && document.activeElement === this.lastFocusableElement;
  }

  _tabbedToStart(e) {
    return e.shiftKey && document.activeElement === this.firstFocusableElement;
  }

  _trapFocus(e) {
    if (this._tabbedToStart(e)) {
      this.lastFocusableElement.focus();
      e.preventDefault();
    } else if (this._tabbedToEnd(e)) {
      this.firstFocusableElement.focus();
      e.preventDefault();
    }
  }

  _attemptEscape() {
    if (this.args.escapable) {
      this.close();
    } else {
      this.warn();
    }
  }

  _invokeAction(name, ...args) {
    const action = this.args[name];

    if (typeof action === 'function') {
      return action(...args);
    }
  }
}
