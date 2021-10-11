import Component from '@glimmer/component';
import ModalDialogHeader from './header';
import ModalDialogContent from './content';
import ModalDialogFooter from './footer';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { all } from 'rsvp';
import { scheduleOnce, debounce } from '@ember/runloop';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { waitFor } from '@ember/test-waiters';
import { waitForAnimation } from '@zestia/animation-utils';

export default class ModalDialogComponent extends Component {
  lastFocusedExternalElement = null;
  lastFocusedInternalElement = null;
  element = null;
  lastMouseDownElement = null;
  mutationObserver = null;
  rootElement = null;
  window = null;

  ModalDialogContent = ModalDialogContent;
  ModalDialogFooter = ModalDialogFooter;
  ModalDialogHeader = ModalDialogHeader;

  @tracked boxElement = null;
  @tracked inViewport = false;
  @tracked isLoading = false;
  @tracked isShowing = true;
  @tracked isWarning = false;

  constructor() {
    super(...arguments);
    this.rootElement = document.querySelector(':root');
    this.window = window;
    this.lastFocusedExternalElement = document.activeElement;
    this._load();
  }

  get api() {
    return {
      boxElement: this.boxElement,
      close: this.close,
      Content: this.ModalDialogContent,
      Footer: this.ModalDialogFooter,
      Header: this.ModalDialogHeader,
      isLoading: this.isLoading
    };
  }

  get focusableElements() {
    return [
      ...this.element.querySelectorAll(`
        a[href],
        button:not(:disabled),
        textarea:not(:disabled),
        input:not(:disabled),
        select:not(:disabled),
        [tabindex="0"],
        [contenteditable="true"]
      `)
    ];
  }

  get firstFocusableElement() {
    return this.focusableElements[0];
  }

  get lastFocusableElement() {
    return this.focusableElements[this.focusableElements.length - 1];
  }

  @action
  async close() {
    await this._hide();
    this._focus(this.lastFocusedExternalElement);
    this.args.onClose?.();
  }

  @action
  async warn() {
    this.isWarning = true;

    await this._waitForAnimation();

    this.isWarning = false;
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
  handleMouseDown(e) {
    this.lastMouseDownElement = e.target;
  }

  @action
  handleMouseUp() {
    if (this.lastMouseDownElement === this.element) {
      this._attemptEscape();
    }
  }

  @action
  handleInsertElement(element) {
    this.element = element;
    this.element.focus();
    this.rootElement.classList.add('has-modal');
    this._disableBodyScroll();
    this._startMonitoringContent();
    this._startMonitoringViewport();
    this._handleContentChanged();
    this._ready();
  }

  @action
  handleDestroyElement() {
    this._enableBodyScroll();
    this._stopMonitoringContent();
    this._stopMonitoringViewport();
    this.rootElement.classList.remove('has-modal');
  }

  @action
  handleInsertBoxElement(element) {
    this.boxElement = element;
  }

  _hide() {
    this.isShowing = false;

    return this._waitForAnimation();
  }

  _ready() {
    this.args.onReady?.(this.api);
  }

  async _load() {
    this.isLoading = true;

    try {
      const data = await this.args.onLoad?.();
      this.args.onLoaded?.(data);
    } catch (error) {
      this.args.onLoadError?.(error);
    } finally {
      this.isLoading = false;
    }
  }

  _startMonitoringContent() {
    this.mutationObserver = new MutationObserver(
      this._handleContentChanged.bind(this)
    );

    this.mutationObserver.observe(this.element, {
      childList: true,
      subtree: true
    });
  }

  _stopMonitoringContent() {
    this.mutationObserver.disconnect();
  }

  _handleContentChanged() {
    scheduleOnce('afterRender', this, '_checkInViewport');
  }

  _startMonitoringViewport() {
    this.winResizeListener = this._handleResizedWindow.bind(this);
    this.winFocusListener = this._handleFocusedWindow.bind(this);
    this.winBlurListener = this._handleBlurredWindow.bind(this);
    this.window.addEventListener('resize', this.winResizeListener);
    this.window.addEventListener('focus', this.winFocusListener);
    this.window.addEventListener('blur', this.winBlurListener);
  }

  _stopMonitoringViewport() {
    this.window.removeEventListener('resize', this.winResizeListener);
    this.window.removeEventListener('focus', this.winFocusListener);
    this.window.removeEventListener('blur', this.winBlurListener);
  }

  _handleResizedWindow() {
    debounce(this, '_checkInViewport', 100);
  }

  _handleBlurredWindow() {
    this.lastFocusedInternalElement = document.activeElement;
  }

  _handleFocusedWindow() {
    this._focus(this.lastFocusedInternalElement);
  }

  _checkInViewport() {
    if (this.isDestroying || this.isDestroyed) {
      return;
    }

    this.inViewport = this._inViewport(this.boxElement);
  }

  _inViewport(element) {
    const rect = element.getBoundingClientRect();
    const win = this.window;

    return (
      rect.top > 0 &&
      rect.left > 0 &&
      rect.bottom < win.innerHeight &&
      rect.right < win.innerWidth
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

  _focus(element) {
    try {
      element.focus();
    } catch (error) {
      // Squelch
    }
  }

  async _attemptEscape() {
    let escapable = this.args.escapable;

    if (typeof this.args.onEscape === 'function') {
      escapable = await this.args.onEscape();
    }

    if (escapable) {
      this.close();
    } else {
      this.warn();
    }
  }

  @waitFor
  async _waitForAnimation() {
    await all([
      waitForAnimation(this.element),
      waitForAnimation(this.boxElement)
    ]);
  }
}
