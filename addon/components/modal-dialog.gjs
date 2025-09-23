import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';
import { tracked } from '@glimmer/tracking';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { waitFor } from '@ember/test-waiters';
import { waitForAnimation } from '@zestia/animation-utils';

export default class ModalDialogComponent extends Component {
  @tracked isInViewport;
  @tracked isLoading = this.shouldLoad;
  @tracked isShowing = true;

  element;
  boxElement;
  lastMouseDownElement;

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

  registerElement = modifier((element) => {
    this.element = element;
  });

  registerBoxElement = modifier((element) => {
    this.boxElement = element;
  });

  bodyScrollLock = modifier((element) => {
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
  });

  inViewport = modifier((element) => {
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
  });

  trapFocus = modifier((element) => {
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
  });

  internalFocus = modifier(() => {
    let last;

    const focused = () => last?.focus();
    const blurred = () => (last = document.activeElement);

    window.addEventListener('focus', focused);
    window.addEventListener('blur', blurred);

    return () => {
      window.removeEventListener('focus', focused);
      window.removeEventListener('blur', blurred);
    };
  });

  externalFocus = modifier(() => {
    const last = document.activeElement;

    return () => {
      try {
        last.focus();
      } catch (error) {
        // Squelch
      }
    };
  });

  escapable = modifier(() => {
    const handler = (event) => {
      if (this.containsModal || event.key !== 'Escape') {
        return;
      }

      this._escape(event);
    };

    window.addEventListener('keydown', handler);

    return () => window.removeEventListener('keydown', handler);
  });

  _escape(event) {
    this.args.onEscape?.(event, this.api);
  }

  async _load() {
    try {
      const data = await this.args.onLoad();
      this.args.onLoaded?.(data, this.api);
    } catch (error) {
      this.args.onLoadError?.(error, this.api);
    } finally {
      this.isLoading = false;
    }
  }

  @waitFor
  _waitForAnimation() {
    return Promise.all([
      waitForAnimation(this.element, { maybe: true }),
      waitForAnimation(this.boxElement, { maybe: true })
    ]);
  }

  get _api() {
    return {
      close: this.close,
      isLoading: this.isLoading,
      element: this.element,
      boxElement: this.boxElement
    };
  }

  api = new Proxy(this, {
    get(target, key) {
      return target._api[key];
    },
    set() {}
  });

  <template>
    {{! template-lint-disable no-pointer-down-event-binding no-invalid-interactive }}
    <div
      class="modal-dialog"
      data-showing="{{this.isShowing}}"
      {{on "mousedown" this.handleMouseDown}}
      {{on "mouseup" this.handleMouseUp}}
      {{this.registerElement}}
      ...attributes
    >
      <div
        class="modal-dialog__box"
        role="dialog"
        aria-modal="true"
        aria-busy="{{this.isLoading}}"
        data-in-viewport="{{this.isInViewport}}"
        {{this.registerBoxElement}}
        {{this.bodyScrollLock}}
        {{this.inViewport}}
        {{this.trapFocus}}
        {{this.externalFocus}}
        {{this.internalFocus}}
        {{this.escapable}}
      >
        {{yield this.api}}
      </div>
    </div>
  </template>
}
