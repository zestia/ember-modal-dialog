import Component from '@ember/component';
import layout from './template';
import { Promise, resolve } from 'rsvp';
import { action, set, trySet } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';

export default class ModalDialogComponent extends Component {
  tagName = '';
  layout = layout;

  // State

  isLoading = false;
  isShowing = true;
  isWarning = false;

  // Arguments

  escapable = false;

  // Actions

  onReady = null;
  onLoaded = null;
  onLoadError = null;
  onClose = null;
  onLoad = null;

  init() {
    this._load();
    super.init(...arguments);
    this.rootElement = document.querySelector(':root');
    this.documentElement = document.documentElement;
  }

  @action
  close() {
    return this._hide().then(() => this._invokeAction('onClose'));
  }

  @action
  warn() {
    set(this, 'isWarning', true);

    this._waitForAnimation().then(() => trySet(this, 'isWarning', false));
  }

  @action
  handleKeydown(e) {
    if (e.keyCode === 27) {
      this._attemptEscape();
    }
  }

  @action
  handleClick(e) {
    if (e.target === this.domElement) {
      this._attemptEscape();
    }
  }

  @action
  handleInsertElement(element) {
    set(this, 'domElement', element);
    this.domElement.focus();
    this.rootElement.classList.add('has-modal');
    this._watchForContentChanges();
    this._ready();
  }

  @action
  handleDestroyElement() {
    this.rootElement.classList.remove('has-modal');
  }

  @action
  handleInsertBoxElement(element) {
    set(this, 'boxElement', element);
  }

  _ready() {
    this._invokeAction('onReady', this._api());
  }

  _api() {
    return {
      close: this.close
    };
  }

  _load() {
    set(this, 'isLoading', true);

    resolve(this._invokeAction('onLoad'))
      .then(data => this._invokeAction('onLoaded', data))
      .catch(error => this._invokeAction('onLoadError', error))
      .finally(() => trySet(this, 'isLoading', false));
  }

  _hide() {
    set(this, 'isShowing', false);

    return this._waitForAnimation();
  }

  _watchForContentChanges() {
    this._mutationObserver = new MutationObserver(
      this._contentChanged.bind(this)
    );

    this._mutationObserver.observe(this.domElement, {
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

    set(this, 'isTooTall', box && doc.clientHeight <= box.clientHeight);
  }

  _waitForAnimation() {
    return new Promise(resolve => {
      this.domElement.addEventListener('animationend', resolve, {
        once: true
      });
    });
  }

  _attemptEscape() {
    if (this.escapable) {
      this.close();
    } else {
      this.warn();
    }
  }

  _invokeAction(name, ...args) {
    if (typeof this[name] === 'function') {
      return this[name](...args);
    }
  }
}
