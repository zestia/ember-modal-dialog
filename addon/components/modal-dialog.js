import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';
import { tracked } from '@glimmer/tracking';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { all } from 'rsvp';
import { action } from '@ember/object';
import { waitFor } from '@ember/test-waiters';
import { waitForAnimation } from '@zestia/animation-utils';

export default class ModalDialogComponent extends Component {
  element = null;
  boxElement = null;
  lastMouseDownElement = null;

  @tracked isInViewport = false;
  @tracked isLoading = this.shouldLoad;
  @tracked isShowing = true;

  constructor() {
    super(...arguments);
    this.args.onReady?.(this.api);

    if (this.shouldLoad) {
      this._load();
    }
  }

  get shouldLoad() {
    return typeof this.args.onLoad === 'function';
  }

  get api() {
    return {
      close: this.close,
      isLoading: this.isLoading,
      element: this.element,
      boxElement: this.boxElement
    };
  }

  get containsModal() {
    return !!this.boxElement.querySelector('.modal-dialog');
  }

  @action
  async close() {
    this.isShowing = false;

    await this._waitForAnimation();

    this.args.onClose?.();
  }

  @action
  handleMouseDown(event) {
    this.lastMouseDownElement = event.target;
  }

  @action
  handleMouseUp(event) {
    if (this.lastMouseDownElement === this.element) {
      this._escape(event);
    }
  }

  registerElement = modifier(
    (element) => {
      this.element = element;
    },
    { eager: false }
  );

  registerBoxElement = modifier(
    (element) => {
      this.boxElement = element;
    },
    { eager: false }
  );

  notifyRoot = modifier(
    () => {
      const root = document.querySelector(':root');

      root.classList.add('has-modal');

      return () => root.classList.remove('has-modal');
    },
    { eager: false }
  );

  bodyScrollLock = modifier(
    (element) => {
      disableBodyScroll(element, {
        reserveScrollBarGap: true,
        allowTouchMove: (element) => {
          while (this.boxElement.contains(element)) {
            if (element.scrollHeight > element.clientHeight) {
              return true;
            }

            element = element.parentElement;
          }
        }
      });

      return () => enableBodyScroll(element);
    },
    { eager: false }
  );

  inViewport = modifier(
    (element) => {
      const handler = () => {
        const rect = element.getBoundingClientRect();

        this.isInViewport =
          rect.top > 0 &&
          rect.left > 0 &&
          rect.bottom < window.innerHeight &&
          rect.right < window.innerWidth;
      };

      const observer = new MutationObserver(handler);

      observer.observe(element, {
        childList: true,
        subtree: true
      });

      window.addEventListener('resize', handler);

      handler();

      return () => {
        observer.disconnect();
        window.removeEventListener('resize', handler);
      };
    },
    { eager: false }
  );

  trapFocus = modifier(
    (element) => {
      const handler = (event) => {
        if (this.containsModal || event.key !== 'Tab') {
          return;
        }

        const focusable = element.querySelectorAll(`
          a[href],
          button:not(:disabled),
          textarea:not(:disabled),
          input:not(:disabled),
          select:not(:disabled),
          [tabindex="0"],
          [contenteditable="true"]
        `);

        const first = focusable.item(0);
        const last = focusable.item(focusable.length - 1);
        const focused = document.activeElement;

        if (event.shiftKey && focused === first) {
          last.focus();
          event.preventDefault();
        } else if (!event.shiftKey && focused === last) {
          first.focus();
          event.preventDefault();
        }
      };

      element.addEventListener('keydown', handler);

      return () => element.removeEventListener('keydown', handler);
    },
    { eager: false }
  );

  internalFocus = modifier(
    () => {
      let last;

      const focused = () => last?.focus();
      const blurred = () => (last = document.activeElement);

      window.addEventListener('focus', focused);
      window.addEventListener('blur', blurred);

      return () => {
        window.removeEventListener('focus', focused);
        window.removeEventListener('blur', blurred);
      };
    },
    { eager: false }
  );

  externalFocus = modifier(
    () => {
      const last = document.activeElement;

      return () => {
        try {
          last.focus();
        } catch (error) {
          // Squelch
        }
      };
    },
    { eager: false }
  );

  escapable = modifier(
    () => {
      const handler = (event) => {
        if (this.containsModal || event.key !== 'Escape') {
          return;
        }

        this._escape(event);
      };

      window.addEventListener('keydown', handler);

      return () => window.removeEventListener('keydown', handler);
    },
    { eager: false }
  );

  _escape(event) {
    this.args.onEscape?.(this.api, event);
  }

  async _load() {
    try {
      const data = await this.args.onLoad();
      this.args.onLoaded?.(data);
    } catch (error) {
      this.args.onLoadError?.(error);
    } finally {
      this.isLoading = false;
    }
  }

  @waitFor
  _waitForAnimation() {
    return all([
      waitForAnimation(this.element),
      waitForAnimation(this.boxElement)
    ]);
  }
}
