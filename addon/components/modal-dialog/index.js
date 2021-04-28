import Component from '@glimmer/component';
import ModalDialogHeader from './header';
import ModalDialogContent from './content';
import ModalDialogFooter from './footer';
import { Promise, resolve } from 'rsvp';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { scheduleOnce } from '@ember/runloop';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { modifier } from 'ember-modifier';

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
    this.activeElement = document.activeElement;
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
    return this._hide().then(() => {
      this._restoreFocus();
      this.args.onClose?.();
    });
  }

  @action
  warn() {
    this.isWarning = true;

    this._waitForAnimation().then(() => (this.isWarning = false));
  }

  @action
  handleKeyDown(e) {
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

  handleElementLifecycle = modifier((element) => {
    this.element = element;
    this._ready();
  });

  handleBoxElementLifecycle = modifier((element) => {
    this.boxElement = element;
  });

  hasModal = modifier(() => {
    this.rootElement.classList.add('has-modal');
    return () => this.rootElement.classList.remove('has-modal');
  });

  bodyScrollLock = modifier((element) => {
    disableBodyScroll(element, {
      reserveScrollBarGap: true,
      allowTouchMove: () => this.boxElement.contains(element)
    });

    return () => enableBodyScroll(element);
  });

  checkIfTooTall = modifier((element) => {
    const observer = new MutationObserver(this._contentChanged.bind(this));

    observer.observe(element, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  });

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

  // _inViewport(element) {
  //   const rect = element.getBoundingClientRect();
  //   const doc = this.documentElement;

  //   return (
  //     rect.top >= 0 &&
  //     rect.left >= 0 &&
  //     rect.bottom <= doc.clientHeight &&
  //     rect.right <= doc.clientWidth
  //   );
  // }

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

  _restoreFocus() {
    try {
      this.activeElement.focus();
    } catch (error) {
      // Squelch
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
