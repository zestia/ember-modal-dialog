import Component from '@glimmer/component';
import { Promise, resolve } from 'rsvp';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { scheduleOnce } from '@ember/runloop';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

export default class ModalDialogComponent extends Component {
  element = null;

  @tracked isLoading = false;
  @tracked isShowing = true;
  @tracked isWarning = false;
  @tracked isTooTall = false;

  constructor() {
    super(...arguments);
    this.rootElement = document.querySelector(':root');
    this.documentElement = document.documentElement;
    this._load();
  }

  get api() {
    return {
      close: this.close
    };
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
    if (e.keyCode === 27) {
      this._attemptEscape();
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
    this._disableBodyScroll();
    this.element = element;
    this.element.focus();
    this.rootElement.classList.add('has-modal');
    this._watchForContentChanges();
    this._ready();
  }

  @action
  handleDestroyElement() {
    this._enableBodyScroll();
    this.rootElement.classList.remove('has-modal');
  }

  @action
  handleInsertBoxElement(element) {
    this.boxElement = element;
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

  _watchForContentChanges() {
    this._mutationObserver = new MutationObserver(
      this._contentChanged.bind(this)
    );

    this._mutationObserver.observe(this.element, {
      childList: true,
      subtree: true
    });

    this._contentChanged();
  }

  _stopWatchingForChanges() {
    this._mutationObserver.disconnect();
  }

  _contentChanged() {
    scheduleOnce('afterRender', this, '_checkIfTooTall');
  }

  _checkIfTooTall() {
    if (this.isDestroying || this.isDestroyed) {
      return;
    }

    const box = this.boxElement;
    const doc = this.documentElement;

    this.isTooTall = box && doc.clientHeight <= box.clientHeight;
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
