import Component from '@glimmer/component';
import ModalDialogHeader from './header';
import ModalDialogContent from './content';
import ModalDialogFooter from './footer';
import { Promise, resolve } from 'rsvp';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { scheduleOnce } from '@ember/runloop';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

export default class ModalDialogComponent extends Component {
  element = null;

  ModalDialogHeader = ModalDialogHeader;
  ModalDialogContent = ModalDialogContent;
  ModalDialogFooter = ModalDialogFooter;

  @tracked isLoading = false;
  @tracked isShowing = true;
  @tracked isWarning = false;
  @tracked isTooTall = false;
  @tracked boxElement = null;

  constructor() {
    super(...arguments);
    this.rootElement = document.querySelector(':root');
    this.documentElement = document.documentElement;
    this._load();
  }

  get api() {
    return {
      Header: this.ModalDialogHeader,
      Content: this.ModalDialogContent,
      Footer: this.ModalDialogFooter,
      close: this.close,
      isLoading: this.isLoading,
      boxElement: this.boxElement
    };
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
    return this._hide().then(() => this.args.onClose?.());
  }

  @action
  warn() {
    this.isWarning = true;

    this._waitForAnimation().then(() => (this.isWarning = false));
  }

  @action
  handleKeyDown(e) {
    if (this._pressedTab(e)) {
      this._trapFocus(e);
    }
  }

  @action
  handleKeyUp(e) {
    if (this._pressedEscape(e)) {
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
    this.element = element;
    this.element.focus();
    this.rootElement.classList.add('has-modal');
    this._disableBodyScroll();
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
    this.args.onReady?.(this.api);
  }

  _load() {
    this.isLoading = true;

    resolve(this.args.onLoad?.())
      .then((data) => this.args.onLoaded?.(data))
      .catch((error) => this.args.onLoadError?.(error))
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

  _inViewport(element) {
    const rect = element.getBoundingClientRect();
    const doc = this.documentElement;

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= doc.clientHeight &&
      rect.right <= doc.clientWidth
    );
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
}