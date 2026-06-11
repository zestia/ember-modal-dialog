import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { waitFor } from '@ember/test-waiters';
import { waitForAnimation } from '@zestia/animation-utils';
import { on } from '@ember/modifier';
import { modifier } from 'ember-modifier';

export default class ModalDialogComponent extends Component {
  @tracked element;
  @tracked isLoading = true;
  @tracked isShowing = true;
  @tracked isWarning;

  modal = modifier(
    (element) => {
      this.element = element;
      this.element.showModal();
    },
    { eager: false }
  );

  constructor() {
    super(...arguments);
    this.args.onReady?.(this.api);
    this.#load();
  }

  handleKeyDown = (event) => {
    if (event.key !== 'Escape') {
      return;
    }

    this.#handleEscape(event);
  };

  handleClick = (event) => {
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
    const { clientX, clientY } = event;
    const { left, right, top, bottom } = this.element.getBoundingClientRect();

    return (
      clientX < left || clientX > right || clientY < top || clientY > bottom
    );
  }

  close = waitFor(async () => {
    this.isShowing = false;
    await waitForAnimation(this.element, { maybe: true });
    this.element.close();
    this.args.onClose();
  });

  @waitFor
  async #warn() {
    this.isWarning = true;
    await waitForAnimation(this.element);
    this.isWarning = false;
  }

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

  <template>
    {{! template-lint-disable no-invalid-interactive }}
    <dialog
      class="modal-dialog"
      aria-busy="{{this.isLoading}}"
      data-showing="{{this.isShowing}}"
      data-warning={{this.isWarning}}
      {{this.modal}}
      {{on "keydown" this.handleKeyDown}}
      {{on "click" this.handleClick}}
      ...attributes
    >
      {{yield this.api}}
    </dialog>
  </template>
}
