import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import waitForAnimation from '../../helpers/wait-for-animation';
import { helper } from '@ember/component/helper';
import { reject, resolve, defer } from 'rsvp';
import {
  click,
  find,
  focus,
  getRootElement,
  render,
  settled,
  triggerEvent,
  triggerKeyEvent
} from '@ember/test-helpers';

const { keys } = Object;

module('modal-dialog', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function (assert) {
    const capture = helper(([arg]) => (this.captured = arg));

    this.owner.register('helper:capture', capture);

    this.close = () => assert.step('closed');
  });

  module('rendering', function () {
    test('it works', async function (assert) {
      assert.expect(7);

      let api;

      this.handleReady = (modal) => (api = modal);

      await render(hbs`
        <ModalDialog
          class="foo"
          @onReady={{this.handleReady}}
          as |modal|
        >
          Content goes here
        </ModalDialog>
      `);

      assert.dom('.modal-dialog').hasClass('modal-dialog--showing');
      assert.dom('.modal-dialog').hasClass('foo', 'splattributes');
      assert.dom('.modal-dialog__box').isFocused();
      assert.dom('.modal-dialog__box').hasAttribute('role', 'dialog');
      assert.dom('.modal-dialog__box').hasAttribute('aria-modal', 'true');

      assert.deepEqual(keys(api), [
        'close',
        'isLoading',
        'element',
        'boxElement'
      ]);

      await waitForAnimation('.modal-dialog', { animationName: 'fade-in' });
      await settled();

      assert.true(true, 'does not use a test waiter');
    });
  });

  module('notify root', function () {
    test('it works', async function (assert) {
      assert.expect(2);

      await render(hbs`
        {{#if this.show}}
          <ModalDialog />
        {{/if}}
      `);

      assert.dom(document.documentElement).doesNotHaveClass('has-modal');

      this.set('show', true);

      assert.dom(document.documentElement).hasClass('has-modal');
    });
  });

  module('internal focus', function () {
    test('no focusable elements', async function (assert) {
      assert.expect(1);

      await render(hbs`
        <button type="button" class="external"></button>

        {{#if this.show}}
          <ModalDialog />
        {{/if}}
      `);

      await focus('.external');

      this.set('show', true);

      await settled();
      await triggerEvent(window, 'blur');
      await triggerEvent(window, 'focus');

      assert.deepEqual(document.activeElement, find('.modal-dialog__box'));
    });

    test('with focusable elements', async function (assert) {
      assert.expect(1);

      await render(hbs`
        <button type="button" class="external"></button>

        {{#if this.show}}
          <ModalDialog>
            <input class="internal1">
            <input class="internal2">
          </ModalDialog>
        {{/if}}
      `);

      await focus('.external');

      this.set('show', true);

      await settled();
      await focus('.internal2');
      await triggerEvent(window, 'blur');
      await triggerEvent(window, 'focus');

      assert.deepEqual(document.activeElement, find('.internal2'));
    });
  });

  module('external focus', function (hooks) {
    hooks.beforeEach(async function () {
      await render(hbs`
        {{#if this.showButton}}
          <button type="button" class="external"></button>
        {{/if}}

        {{#if this.showModal}}
          <ModalDialog>
             <button type="button" class="internal"></button>
          </ModalDialog>
        {{/if}}
      `);
    });

    test('focus is restored after close', async function (assert) {
      assert.expect(3);

      this.set('showButton', true);

      await focus('.external');

      assert.dom('.external').isFocused();

      this.set('showModal', true);

      assert.dom('.modal-dialog__box').isFocused();

      this.set('showModal', false);

      assert.dom('.external').isFocused();
    });

    test('does not blow up', async function (assert) {
      assert.expect(3);

      this.set('showButton', true);

      await focus('.external');

      assert.dom('.external').isFocused();

      this.set('showModal', true);
      this.set('showButton', false);

      assert.dom('.modal-dialog__box').isFocused();

      this.set('showModal', false);

      assert.dom(document.body).isFocused();
    });
  });

  module('focus trap', function (hooks) {
    hooks.beforeEach(async function () {
      await render(hbs`
        <button type="button" class="external"></button>

        <ModalDialog as |modal|>
          <button type="button" class="first"></button>
          <button type="button" class="second"></button>
          <button type="button" class="third"></button>
        </ModalDialog>
     `);
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
  });

  module('in viewport', function () {
    test('changing content', async function (assert) {
      assert.expect(2);

      getRootElement().parentNode.classList.add('full-screen');

      await render(hbs`
        <ModalDialog as |modal|>
          <div class="internal"></div>
        </ModalDialog>
      `);

      assert
        .dom('.modal-dialog__box')
        .doesNotHaveClass('modal-dialog__box--exceeds-viewport');

      find('.internal').innerHTML = '<br>'.repeat(10000);

      await settled();

      assert
        .dom('.modal-dialog__box')
        .hasClass('modal-dialog__box--exceeds-viewport');

      getRootElement().parentNode.classList.remove('full-screen');
    });
  });

  module('body scroll lock', function () {
    test('it works', async function (assert) {
      assert.expect(3);

      await render(hbs`
        {{#if this.show}}
          <ModalDialog />
        {{/if}}
      `);

      assert.dom(document.body).hasStyle({ overflow: 'visible' });

      this.set('show', true);

      await settled();

      assert.dom(document.body).hasStyle({ overflow: 'hidden' });

      this.set('show', false);

      await settled();

      assert.dom(document.body).hasStyle({ overflow: 'visible' });
    });
  });

  module('loading', function () {
    test('action order', async function (assert) {
      assert.expect(3);

      const deferred = defer();

      this.load = () => {
        assert.step('load');

        return deferred.promise;
      };

      this.inserted = () => assert.step('inserted');

      await render(hbs`
        <ModalDialog
          @onLoad={{this.load}}
          {{did-insert this.inserted}}
        />
      `);

      assert.verifySteps(['load', 'inserted']);
    });

    test('success', async function (assert) {
      assert.expect(4);

      const deferred = defer();

      this.load = () => deferred.promise;
      this.loaded = (data) => (this.name = data);

      await render(hbs`
        <ModalDialog
          @onLoad={{this.load}}
          @onLoaded={{this.loaded}}
          as |modal|
        >
          {{#if modal.isLoading}}
            Please wait…
          {{else}}
            Hello {{this.name}}
          {{/if}}
        </ModalDialog>
      `);

      assert.dom('.modal-dialog').hasClass('modal-dialog--loading');
      assert.dom('.modal-dialog').hasText('Please wait…');

      deferred.resolve('World');

      await settled();

      assert.dom('.modal-dialog').doesNotHaveClass('modal-dialog--loading');
      assert.dom('.modal-dialog').hasText('Hello World');
    });

    test('failure', async function (assert) {
      assert.expect(2);

      this.load = () => reject({ message: 'sorry' });
      this.loadError = (error) => this.set('error', error);

      await render(hbs`
        <ModalDialog @onLoad={{this.load}} @onLoadError={{this.loadError}}>
          {{#if this.error}}
            Failed {{this.error.message}}
          {{/if}}
        </ModalDialog>
      `);

      assert.dom('.modal-dialog').doesNotHaveClass('modal-dialog--loading');
      assert.dom('.modal-dialog').hasText('Failed sorry');
    });

    test('infinite revalidation', async function (assert) {
      assert.expect(0);

      /* eslint-disable no-console */

      const warn = console.warn;

      console.warn = () => {
        console.warn = warn;

        throw new Error('autotracking.mutation-after-consumption');
      };

      this.handleReady = () => {};
      this.load = () => resolve();

      await render(hbs`
        <ModalDialog
          @onReady={{this.handleReady}}
          @onLoad={{@onLoad}}
        />
      `);
    });
  });

  module('closing', function () {
    test('waits for animation', async function (assert) {
      assert.expect(3);

      await render(hbs`
        <ModalDialog @onClose={{this.close}} as |modal|>
          <button type="button" {{on "click" modal.close}}>Close</button>
        </ModalDialog>
      `);

      click('button');

      assert.verifySteps([]);

      await waitForAnimation('.modal-dialog', {
        animationName: 'fade-out'
      });

      await settled();

      assert.verifySteps(['closed']);
    });

    test('test waiter', async function (assert) {
      assert.expect(1);

      this.close = () => this.set('show', false);

      this.show = true;

      await render(hbs`
        {{#if this.show}}
          <ModalDialog @onClose={{this.close}} as |modal|>
            <button type="button" {{on "click" modal.close}}>Close</button>
          </ModalDialog>
        {{/if}}
      `);

      await click('button');

      assert.dom('.modal-dialog').doesNotExist();
    });

    test('api close', async function (assert) {
      assert.expect(2);

      let api;

      this.handleReady = (modal) => (api = modal);

      await render(hbs`
        <ModalDialog
          @onReady={{this.handleReady}}
          @onClose={{this.close}}
          as |modal|
        >
          <button type="button" {{on "click" modal.close}}>Close</button>
        </ModalDialog>
      `);

      await api.close();

      assert.verifySteps(['closed']);
    });

    test('missing close argument', async function (assert) {
      assert.expect(1);

      await render(hbs`
        <ModalDialog @onClose={{null}} as |modal|>
          <button type="button" {{on "click" modal.close}}>Close</button>
        </ModalDialog>
      `);

      await click('button');

      assert.ok(true, 'does not blow up if onClose is not a function');
    });
  });

  module('escaping', function (hooks) {
    test('pressing escape', async function (assert) {
      assert.expect(2);

      this.escape = (api, event) =>
        assert.step(`${event instanceof KeyboardEvent}`);

      await render(hbs`<ModalDialog @onEscape={{this.escape}} />`);

      await triggerKeyEvent('.modal-dialog', 'keydown', 'Escape');

      assert.verifySteps(['true']);
    });

    test('clicking outside', async function (assert) {
      assert.expect(2);

      this.escape = (api, event) =>
        assert.step(`${event instanceof MouseEvent}`);

      await render(hbs`<ModalDialog @onEscape={{this.escape}} />`);

      await click('.modal-dialog');

      assert.verifySteps(['true']);
    });

    test('clicking inside and releasing outside', async function (assert) {
      assert.expect(1);

      this.escape = () => assert.step('escaped');

      await render(hbs`<ModalDialog @onEscape={{this.escape}} />`);

      await triggerEvent('.modal-dialog__box', 'mousedown');
      await triggerEvent('.modal-dialog', 'mouseup');

      assert.verifySteps([]);
    });
  });
});
