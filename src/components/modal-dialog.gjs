import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { waitFor } from '@ember/test-waiters';
import { waitForAnimation } from '@zestia/animation-utils';
import { on } from '@ember/modifier';
import { modifier } from 'ember-modifier';

export default class ModalDialogComponent extends Component {
  @tracked element;
  @tracked isLoading = true;
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

    this.#handleEscape(event, this.api);
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

    if (this.args.escapable) {
      this.close();
    } else {
      this._warn();
    }
  }

  close = async () => {
    this.element.close();
    await waitFor(waitForAnimation(this.element, { maybe: true }));
    this.args.onClose();
  };

  @waitFor
  async _warn() {
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
      data-warning={{this.isWarning}}
      {{this.modal}}
      {{on "keydown" this.handleKeyDown}}
      ...attributes
    >
      {{yield this.api}}
    </dialog>
  </template>
}
