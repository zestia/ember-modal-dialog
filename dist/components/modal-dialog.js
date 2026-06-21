import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { waitFor } from '@ember/test-waiters';
import { waitForAnimation } from '@zestia/animation-utils';
import { on } from '@ember/modifier';
import { modifier } from 'ember-modifier';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';
import { g, i } from 'decorator-transforms/runtime-esm';

class ModalDialogComponent extends Component {
  static {
    g(this.prototype, "element", [tracked]);
  }
  #element = (i(this, "element"), void 0);
  static {
    g(this.prototype, "isLoading", [tracked], function () {
      return true;
    });
  }
  #isLoading = (i(this, "isLoading"), void 0);
  static {
    g(this.prototype, "isShowing", [tracked], function () {
      return true;
    });
  }
  #isShowing = (i(this, "isShowing"), void 0);
  static {
    g(this.prototype, "isWarning", [tracked]);
  }
  #isWarning = (i(this, "isWarning"), void 0);
  modal = modifier(element => {
    this.element = element;
    if (!element.open) {
      element.showModal();
    }
  });
  constructor() {
    super(...arguments);
    this.args.onReady?.(this.api);
    this.#load();
  }
  handleKeyDown = event => {
    if (event.key !== 'Escape') {
      return;
    }
    this.#handleEscape(event);
  };
  handleClick = event => {
    if (!this.#isBackdrop(event)) {
      return;
    }
    event.preventDefault();
    this.#handleDismissAttempt();
  };
  async #load() {
    try {
      const data = await this.args.onLoad?.();
      this.args.onLoaded?.(data, this.api);
    } catch (error) {
      this.args.onLoadError?.(error, this.api);
    } finally {
      this.isLoading = false;
    }
  }
  #handleEscape(event) {
    event.preventDefault();
    this.#handleDismissAttempt();
  }
  #handleDismissAttempt() {
    if (this.args.escapable) {
      this.close();
    } else {
      this.#warn();
    }
  }
  #isBackdrop(event) {
    const {
      clientX,
      clientY
    } = event;
    const {
      left,
      right,
      top,
      bottom
    } = this.element.getBoundingClientRect();
    return event.target === this.element && (clientX < left || clientX > right || clientY < top || clientY > bottom);
  }
  close = waitFor(async () => {
    if (!this.isShowing) {
      return;
    }
    this.isShowing = false;
    await waitForAnimation(this.element, {
      maybe: true
    });
    this.element.close();
    this.args.onClose();
  });
  #warn = waitFor(async () => {
    this.isWarning = true;
    await waitForAnimation(this.element);
    this.isWarning = false;
  });
  get #api() {
    return {
      close: this.close,
      isLoading: this.isLoading
    };
  }
  api = new Proxy(this, {
    get(target, key) {
      return target.#api[key];
    },
    set() {}
  });
  static {
    setComponentTemplate(precompileTemplate("{{!-- template-lint-disable no-invalid-interactive --}}\n<dialog class=\"modal-dialog\" aria-busy=\"{{this.isLoading}}\" data-showing=\"{{this.isShowing}}\" data-warning={{this.isWarning}} {{this.modal}} {{on \"keydown\" this.handleKeyDown}} {{on \"click\" this.handleClick}} ...attributes>\n  {{yield this.api}}\n</dialog>", {
      strictMode: true,
      scope: () => ({
        on
      })
    }), this);
  }
}

export { ModalDialogComponent as default };
//# sourceMappingURL=modal-dialog.js.map
