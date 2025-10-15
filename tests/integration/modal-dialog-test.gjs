import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import waitForAnimation from '../helpers/wait-for-animation';
import { modifier } from 'ember-modifier';
import ModalDialog from '@zestia/ember-modal-dialog/components/modal-dialog';
import { on } from '@ember/modifier';
import { tracked } from '@glimmer/tracking';
import {
  click,
  render,
  waitFor,
  settled,
  triggerKeyEvent
} from '@ember/test-helpers';

module('modal-dialog', function (hooks) {
  setupRenderingTest(hooks);

  let close;

  hooks.beforeEach(function (assert) {
    close = () => assert.step('closed');
  });

  module('rendering', function () {
    test('it works', async function (assert) {
      assert.expect(4);

      await render(
        <template>
          <ModalDialog class="foo">
            Content goes here
          </ModalDialog>
        </template>
      );

      assert
        .dom('.modal-dialog')
        .hasAttribute('open')
        .hasClass('foo', 'splattributes')
        .hasTagName('dialog')
        .hasAttribute('aria-busy', 'false');
    });
  });

  module('loading', function () {
    test('action order', async function (assert) {
      assert.expect(3);

      const deferred = Promise.withResolvers();

      const load = () => {
        assert.step('load');

        return deferred.promise;
      };

      const inserted = modifier(() => assert.step('inserted'), {
        eager: false
      });

      await render(
        <template><ModalDialog @onLoad={{load}} {{inserted}} /></template>
      );

      assert.verifySteps(['load', 'inserted']);
    });

    test('success', async function (assert) {
      assert.expect(4);

      const state = new (class {
        @tracked name;
      })();

      const deferred = Promise.withResolvers();

      const load = () => deferred.promise;
      const loaded = (data) => (state.name = data);

      await render(
        <template>
          <ModalDialog @onLoad={{load}} @onLoaded={{loaded}} as |modal|>
            {{#if modal.isLoading}}
              Please wait…
            {{else}}
              Hello
              {{state.name}}
            {{/if}}
          </ModalDialog>
        </template>
      );

      assert.dom('.modal-dialog').hasAttribute('aria-busy', 'true');
      assert.dom('.modal-dialog').hasText('Please wait…');

      deferred.resolve('World');

      await settled();

      assert.dom('.modal-dialog').hasAttribute('aria-busy', 'false');
      assert.dom('.modal-dialog').hasText('Hello World');
    });

    test('failure', async function (assert) {
      assert.expect(2);

      const state = new (class {
        @tracked error;
      })();

      const load = () => Promise.reject(new Error('sorry'));
      const loadError = (error) => (state.error = error);

      await render(
        <template>
          <ModalDialog @onLoad={{load}} @onLoadError={{loadError}}>
            {{#if state.error}}
              Failed
              {{state.error.message}}
            {{/if}}
          </ModalDialog>
        </template>
      );

      assert.dom('.modal-dialog').hasAttribute('aria-busy', 'false');
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

      const handleReady = () => {};
      const load = () => Promise.resolve();

      await render(
        <template>
          <ModalDialog @onReady={{handleReady}} @onLoad={{load}} />
        </template>
      );
    });
  });

  module('closing', function () {
    test('waits for animation', async function (assert) {
      assert.expect(4);

      await render(
        <template>
          <ModalDialog @onClose={{close}} as |modal|>
            <button type="button" {{on "click" modal.close}}>Close</button>
          </ModalDialog>
        </template>
      );

      click('button');

      assert.verifySteps([]);

      const animations = await waitForAnimation('.modal-dialog');

      assert.strictEqual(animations.length, 2);

      await settled();

      assert.verifySteps(['closed']);
    });

    test('does not accidentally wait for child animations', async function (assert) {
      assert.expect(2);

      await render(
        <template>
          {{! template-lint-disable no-forbidden-elements }}
          {{! prettier-ignore }}
          <style>
            @keyframes ani { to { margin-left: 10px } }
            .animation { animation: ani 1s infinite; }
          </style>

          <ModalDialog @onClose={{close}} as |modal|>
            <div class="animation"></div>
            <button type="button" {{on "click" modal.close}}>Close</button>
          </ModalDialog>
        </template>
      );

      await click('button');

      assert.verifySteps(['closed']);
    });

    test('api close', async function (assert) {
      assert.expect(2);

      let api;

      const handleReady = (modal) => (api = modal);

      await render(
        <template>
          <ModalDialog @onReady={{handleReady}} @onClose={{close}} as |modal|>
            <button type="button" {{on "click" modal.close}}>Close</button>
          </ModalDialog>
        </template>
      );

      await api.close();

      assert.verifySteps(['closed']);
    });

    skip('missing close argument', async function (assert) {
      assert.expect(1);

      await render(
        <template>
          <ModalDialog as |modal|>
            <button type="button" {{on "click" modal.close}}>Close</button>
          </ModalDialog>
        </template>
      );

      await click('button');

      assert.ok(true, 'blows up if onClose is not a function');
    });
  });

  module('escaping', function () {
    test('pressing escape (escapable)', async function (assert) {
      assert.expect(3);

      await render(
        <template>
          <ModalDialog @escapable={{true}} @onClose={{close}} />
        </template>
      );

      await triggerKeyEvent('.modal-dialog', 'keydown', 'Escape');

      assert.verifySteps(['closed']);

      assert.dom('.modal-dialog').doesNotHaveAttribute('open');
    });

    test('pressing escape (not escapable)', async function (assert) {
      assert.expect(3);

      await render(<template><ModalDialog @onClose={{close}} /></template>);

      triggerKeyEvent('.modal-dialog', 'keydown', 'Escape');

      await waitFor('.modal-dialog[data-warning]');

      const animations = await waitForAnimation('.modal-dialog');

      assert.strictEqual(animations.length, 2);

      await settled();

      assert.dom('.modal-dialog').doesNotHaveAttribute('data-warning');

      assert.verifySteps([]);
    });
  });

  module('api', function () {
    test('api', async function (assert) {
      assert.expect(2);

      let api;

      const capture = (modal) => (api = modal);

      await render(
        <template>
          <ModalDialog as |modal|>
            {{capture modal}}
          </ModalDialog>
        </template>
      );

      assert.strictEqual(typeof api.close, 'function');
      assert.false(api.isLoading);
    });
  });
});
