import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import waitForAnimation from 'dummy/tests/helpers/wait-for-animation';
import { reject, resolve, defer } from 'rsvp';
import { modifier } from 'ember-modifier';
import ModalDialog from '@zestia/ember-modal-dialog/components/modal-dialog';
import autoFocus from '@zestia/ember-auto-focus/modifiers/auto-focus';
import { on } from '@ember/modifier';
import { tracked } from '@glimmer/tracking';
import {
  click,
  find,
  focus,
  getRootElement,
  render,
  rerender,
  settled,
  triggerEvent,
  triggerKeyEvent
} from '@ember/test-helpers';

module('modal-dialog', function (hooks) {
  setupRenderingTest(hooks);

  module('rendering', function () {
    test('it works', async function (assert) {
      assert.expect(5);

      await render(<template>
        <ModalDialog class="foo">
          Content goes here
        </ModalDialog>
      </template>);

      assert.dom('.modal-dialog').hasAttribute('data-showing', 'true');
      assert.dom('.modal-dialog').hasClass('foo', 'splattributes');
      assert.dom('.modal-dialog__box').hasAttribute('role', 'dialog');
      assert.dom('.modal-dialog__box').hasAttribute('aria-modal', 'true');
      assert.dom('.modal-dialog__box').hasAttribute('aria-busy', 'false');
    });
  });

  module('internal focus', function () {
    test('no focusable elements', async function (assert) {
      assert.expect(1);

      const state = new (class {
        @tracked show;
      })();

      await render(<template>
        <button type="button" class="external"></button>

        {{#if state.show}}
          <ModalDialog />
        {{/if}}
      </template>);

      await focus('.external');

      state.show = true;

      await triggerEvent(window, 'blur');
      await triggerEvent(window, 'focus');

      assert.deepEqual(document.activeElement, find('.external'));
    });

    test('with focusable elements', async function (assert) {
      assert.expect(1);

      const state = new (class {
        @tracked show;
      })();

      await render(<template>
        <button type="button" class="external"></button>

        {{#if state.show}}
          <ModalDialog>
            <input class="internal1" aria-label="Example 1" />
            <input class="internal2" aria-label="Example 2" />
          </ModalDialog>
        {{/if}}
      </template>);

      await focus('.external');

      state.show = true;

      await focus('.internal2');
      await triggerEvent(window, 'blur');
      await triggerEvent(window, 'focus');

      assert.deepEqual(document.activeElement, find('.internal2'));
    });

    test('ie', async function (assert) {
      assert.expect(0);

      await render(<template><ModalDialog /></template>);

      await triggerEvent(window, 'focus');
    });
  });

  module('external focus', function (hooks) {
    let state;

    hooks.beforeEach(function () {
      state = new (class {
        @tracked showButton;
        @tracked showModal;
      })();

      return render(<template>
        {{#if state.showButton}}
          <button type="button" class="external"></button>
        {{/if}}

        {{#if state.showModal}}
          <ModalDialog>
            <button type="button" class="internal" {{autoFocus}}></button>
          </ModalDialog>
        {{/if}}
      </template>);
    });

    test('focus is restored after close', async function (assert) {
      assert.expect(3);

      state.showButton = true;

      await focus('.external');

      assert.dom('.external').isFocused();

      state.showModal = true;

      await rerender();

      assert.dom('.internal').isFocused();

      state.showModal = false;

      await rerender();

      assert.dom('.external').isFocused();
    });

    test('does not blow up', async function (assert) {
      assert.expect(3);

      state.showButton = true;

      await focus('.external');

      assert.dom('.external').isFocused();

      state.showModal = true;
      state.showButton = false;

      await rerender();

      assert.dom('.internal').isFocused();

      state.showModal = false;

      await rerender();

      assert.dom(document.body).isFocused();
    });
  });

  module('focus trap', function (hooks) {
    hooks.beforeEach(function () {
      return render(<template>
        <button type="button" class="external"></button>

        <ModalDialog>
          <button type="button" class="first"></button>
          <button type="button" class="second"></button>
          <button type="button" class="third"></button>
        </ModalDialog>
      </template>);
    });

    test('tabbing forwards', async function (assert) {
      assert.expect(1);

      await focus('.third');
      await triggerKeyEvent('.modal-dialog__box', 'keydown', 'Tab');

      assert.deepEqual(find('.first'), document.activeElement);
    });

    test('tabbing backwards', async function (assert) {
      assert.expect(1);

      await focus('.first');
      await triggerKeyEvent('.modal-dialog__box', 'keydown', 'Tab', {
        shiftKey: true
      });

      assert.deepEqual(find('.third'), document.activeElement);
    });

    test('nested modals', async function (assert) {
      assert.expect(1);

      await render(<template>
        <ModalDialog>
          <ModalDialog class="nested">
            <button type="button"></button>
          </ModalDialog>
        </ModalDialog>
      </template>);

      await focus('.nested button');
      await triggerKeyEvent('.nested .modal-dialog__box', 'keydown', 'Tab');

      assert.dom('.nested button').isFocused();
    });
  });

  module('in viewport', function () {
    test('changing content', async function (assert) {
      assert.expect(2);

      getRootElement().parentNode.classList.add('full-screen');

      await render(<template>
        <ModalDialog>
          <div class="internal"></div>
        </ModalDialog>
      </template>);

      assert.dom('.modal-dialog__box').hasAttribute('data-in-viewport', 'true');

      find('.internal').innerHTML = '<br>'.repeat(10000);

      await settled();

      assert
        .dom('.modal-dialog__box')
        .hasAttribute('data-in-viewport', 'false');

      getRootElement().parentNode.classList.remove('full-screen');
    });
  });

  module('body scroll lock', function () {
    test('it works', async function (assert) {
      assert.expect(3);

      const state = new (class {
        @tracked show;
      })();

      await render(<template>
        {{#if state.show}}
          <ModalDialog />
        {{/if}}
      </template>);

      assert.dom(document.body).hasStyle({ overflow: 'visible' });

      state.show = true;

      await settled();

      assert.dom(document.body).hasStyle({ overflow: 'hidden' });

      state.show = false;

      await settled();

      assert.dom(document.body).hasStyle({ overflow: 'visible' });
    });
  });

  module('loading', function () {
    test('action order', async function (assert) {
      assert.expect(3);

      const deferred = defer();

      const load = () => {
        assert.step('load');

        return deferred.promise;
      };

      const inserted = modifier(() => assert.step('inserted'), {
        eager: false
      });

      await render(<template>
        <ModalDialog @onLoad={{load}} {{inserted}} />
      </template>);

      assert.verifySteps(['load', 'inserted']);
    });

    test('success', async function (assert) {
      assert.expect(4);

      const state = new (class {
        @tracked name;
      })();

      const deferred = defer();

      const load = () => deferred.promise;
      const loaded = (data) => (state.name = data);

      await render(<template>
        <ModalDialog @onLoad={{load}} @onLoaded={{loaded}} as |modal|>
          {{#if modal.isLoading}}
            Please wait…
          {{else}}
            Hello
            {{state.name}}
          {{/if}}
        </ModalDialog>
      </template>);

      assert.dom('.modal-dialog__box').hasAttribute('aria-busy', 'true');
      assert.dom('.modal-dialog__box').hasText('Please wait…');

      deferred.resolve('World');

      await settled();

      assert.dom('.modal-dialog__box').hasAttribute('aria-busy', 'false');
      assert.dom('.modal-dialog__box').hasText('Hello World');
    });

    test('failure', async function (assert) {
      assert.expect(2);

      const state = new (class {
        @tracked error;
      })();

      const load = () => reject({ message: 'sorry' });
      const loadError = (error) => (state.error = error);

      await render(<template>
        <ModalDialog @onLoad={{load}} @onLoadError={{loadError}}>
          {{#if state.error}}
            Failed
            {{state.error.message}}
          {{/if}}
        </ModalDialog>
      </template>);

      assert.dom('.modal-dialog__box').hasAttribute('aria-busy', 'false');
      assert.dom('.modal-dialog__box').hasText('Failed sorry');
    });

    test('infinite revalidation', async function (assert) {
      assert.expect(0);

      /* eslint-disable no-console */

      const warn = console.warn;

      console.warn = () => {
        console.warn = warn;

        throw new Error('autotracking.mutation-after-consumption');
      };

      const handleReady = () => {};
      const load = () => resolve();

      await render(<template>
        <ModalDialog @onReady={{handleReady}} @onLoad={{load}} />
      </template>);
    });
  });

  module('closing', function (hooks) {
    let close;

    hooks.beforeEach(function (assert) {
      close = () => assert.step('closed');
    });

    test('waits for animation', async function (assert) {
      assert.expect(4);

      await render(<template>
        <ModalDialog @onClose={{close}} as |modal|>
          <button type="button" {{on "click" modal.close}}>Close</button>
        </ModalDialog>
      </template>);

      click('button');

      assert.verifySteps([]);

      const animations = await waitForAnimation('.modal-dialog', {
        animationName: 'fade-out'
      });

      assert.strictEqual(animations.length, 1);

      await settled();

      assert.verifySteps(['closed']);
    });

    test('does not accidentally wait for child animations', async function (assert) {
      assert.expect(2);

      await render(<template>
        {{! template-lint-disable no-forbidden-elements }}
        <style>
          @keyframes ani { to { margin-left: 10px } } .animation { animation:
          ani 1s infinite; }
        </style>
        <ModalDialog @onClose={{close}} as |modal|>
          <div class="animation"></div>
          <button type="button" {{on "click" modal.close}}>Close</button>
        </ModalDialog>
      </template>);

      await click('button');

      assert.verifySteps(['closed']);
    });

    test('test waiter', async function (assert) {
      assert.expect(1);

      const state = new (class {
        @tracked show = true;
      })();

      const close = () => (state.show = false);

      await render(<template>
        {{#if state.show}}
          <ModalDialog @onClose={{close}} as |modal|>
            <button type="button" {{on "click" modal.close}}>Close</button>
          </ModalDialog>
        {{/if}}
      </template>);

      await click('button');

      assert.dom('.modal-dialog').doesNotExist();
    });

    test('api close', async function (assert) {
      assert.expect(2);

      let api;

      const handleReady = (modal) => (api = modal);

      await render(<template>
        <ModalDialog @onReady={{handleReady}} @onClose={{close}} as |modal|>
          <button type="button" {{on "click" modal.close}}>Close</button>
        </ModalDialog>
      </template>);

      await api.close();

      assert.verifySteps(['closed']);
    });

    test('missing close argument', async function (assert) {
      assert.expect(1);

      await render(<template>
        <ModalDialog @onClose={{null}} as |modal|>
          <button type="button" {{on "click" modal.close}}>Close</button>
        </ModalDialog>
      </template>);

      await click('button');

      assert.ok(true, 'does not blow up if onClose is not a function');
    });
  });

  module('escaping', function (hooks) {
    test('pressing escape', async function (assert) {
      assert.expect(2);

      const escape = (api, event) =>
        assert.step(`${event instanceof KeyboardEvent}`);

      await render(<template><ModalDialog @onEscape={{escape}} /></template>);

      await triggerKeyEvent(window, 'keydown', 'Escape');

      assert.verifySteps(['true']);
    });

    test('clicking outside', async function (assert) {
      assert.expect(2);

      const escape = (api, event) =>
        assert.step(`${event instanceof MouseEvent}`);

      await render(<template><ModalDialog @onEscape={{escape}} /></template>);

      await click('.modal-dialog');

      assert.verifySteps(['true']);
    });

    test('clicking inside and releasing outside', async function (assert) {
      assert.expect(1);

      const escape = () => assert.step('escaped');

      await render(<template><ModalDialog @onEscape={{escape}} /></template>);

      await triggerEvent('.modal-dialog__box', 'mousedown');
      await triggerEvent('.modal-dialog', 'mouseup');

      assert.verifySteps([]);
    });

    test('nested modals', async function (assert) {
      assert.expect(2);

      const escape1 = () => assert.step('escaped 1');
      const escape2 = () => assert.step('escaped 2');

      await render(<template>
        <ModalDialog @onEscape={{escape1}}>
          <ModalDialog @onEscape={{escape2}} />
        </ModalDialog>
      </template>);

      await triggerKeyEvent(window, 'keydown', 'Escape');

      assert.verifySteps(['escaped 2']);
    });
  });

  module('api', function () {
    test('api', async function (assert) {
      assert.expect(4);

      let api;

      const capture = (modal) => (api = modal);

      await render(<template>
        <ModalDialog as |modal|>
          {{capture modal}}
        </ModalDialog>
      </template>);

      assert.strictEqual(typeof api.close, 'function');
      assert.false(api.isLoading);
      assert.strictEqual(api.element, find('.modal-dialog'));
      assert.strictEqual(api.boxElement, find('.modal-dialog__box'));
    });
  });
});
