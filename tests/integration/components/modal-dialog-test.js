import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import waitForAnimation from '../../helpers/wait-for-animation';
import ModalDialogComponent from '@zestia/ember-modal-dialog/components/modal-dialog';
import { helper } from '@ember/component/helper';
import { reject, defer } from 'rsvp';
import {
  find,
  render,
  settled,
  focus,
  triggerKeyEvent,
  click
} from '@ember/test-helpers';

module('modal-dialog', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const capture = helper(([arg]) => (this.captured = arg));

    this.owner.register('helper:capture', capture);
  });

  module('rendering', function () {
    test('it works', async function (assert) {
      assert.expect(9);

      await render(hbs`
        <ModalDialog as |modal|>
          <modal.Header class="foo">
            Header goes here
          </modal.Header>

          <modal.Content class="bar">
            Content goes here
          </modal.Content>

          <modal.Footer class="baz">
            Footer goes here
          </modal.Footer>
        </ModalDialog>
      `);

      assert
        .dom('.modal-dialog')
        .hasClass('modal-dialog--showing', 'showing by default');

      assert.dom('.modal-dialog').hasAttribute('role', 'dialog');

      assert.dom('.modal-dialog').hasAttribute('aria-modal', 'true');

      assert.dom('.modal-dialog__header').exists('can render the header');

      assert.dom('.modal-dialog__header').exists('can render the content');

      assert.dom('.modal-dialog__header').exists('can render the footer');

      assert.dom('.modal-dialog__header').hasClass('foo', 'splattributes');

      assert.dom('.modal-dialog__content').hasClass('bar', 'splattributes');

      assert.dom('.modal-dialog__footer').hasClass('baz', 'splattributes');
    });

    test('root element', async function (assert) {
      // It's useful to inform the root element that a modal dialog is present
      // in the DOM, because you may wish to add styles to prevent document
      // scrolling or blur the background for example.

      assert.expect(2);

      await render(hbs`
        {{#if this.show}}
          <ModalDialog />
        {{/if}}
      `);

      assert
        .dom(document.documentElement)
        .doesNotHaveClass(
          'has-modal',
          'root element knows a modal dialog is not present'
        );

      this.set('show', true);

      assert
        .dom(document.documentElement)
        .hasClass(
          'has-modal',
          'root element is informed when a modal dialog is present'
        );
    });

    test('focus', async function (assert) {
      assert.expect(4);

      await render(hbs`
        <button type="button" class="external"></button>

        {{#if this.showModal}}
          <ModalDialog as |modal|>
            <button type="button" class="internal" {{on "click" modal.close}}></button>
          </ModalDialog>
        {{/if}}
      `);

      await focus('.external');

      assert
        .dom('.external')
        .isFocused('initial focus is on an element outside the modal');

      this.set('showModal', true);

      assert
        .dom('.modal-dialog')
        .isFocused('modal is focused to respond the keyboard');

      await click('.internal');

      assert
        .dom('.internal')
        .isFocused(
          "focus isn't restored until after the animation (full closure)"
        );

      await waitForAnimation('.modal-dialog');

      assert
        .dom('.external')
        .isFocused('focus is returned to the originally focused element');
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

      this.inserted = () => {
        assert.step('inserted');
      };

      await render(hbs`
        <ModalDialog
          @onLoad={{this.load}}
          {{did-insert this.inserted}}
        />
      `);

      assert.verifySteps(
        ['load', 'inserted'],
        'load action fires before dom node is inserted. ' +
          'this is so a loading state will be immediately visible'
      );
    });

    test('success', async function (assert) {
      assert.expect(4);

      const deferred = defer();

      this.load = () => deferred.promise;
      this.loaded = (data) => (this.name = data);

      await render(hbs`
        <ModalDialog
          @onLoad={{this.load}}
          @onLoaded={{this.loaded}} as |modal|>
          {{#if modal.isLoading}}
            Please wait…
          {{else}}
            Hello {{this.name}}
          {{/if}}
        </ModalDialog>
      `);

      assert
        .dom('.modal-dialog')
        .hasClass(
          'modal-dialog--loading',
          'modal dialog is in a loading state'
        );

      assert
        .dom('.modal-dialog')
        .hasText('Please wait…', 'yields whether or not the modal is loading');

      deferred.resolve('World');

      await settled();

      assert
        .dom('.modal-dialog')
        .doesNotHaveClass(
          'modal-dialog--loading',
          'loading class removed after loaded'
        );

      assert
        .dom('.modal-dialog')
        .hasText('Hello World', 'yields correctly after loading has finished');
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

      assert
        .dom('.modal-dialog')
        .doesNotHaveClass(
          'modal-dialog--loading',
          'loading class removed after failure to load'
        );

      assert
        .dom('.modal-dialog')
        .hasText('Failed sorry', 'yields correctly after loading has failed');
    });
  });

  module('api', function () {
    test('yielded close', async function (assert) {
      assert.expect(3);

      this.close = () => assert.step('close');

      await render(hbs`
        <ModalDialog @onClose={{this.close}} as |modal|>
          <button type="button" {{on "click" modal.close}}>Close</button>
        </ModalDialog>
      `);

      await click('button');

      assert
        .dom('.modal-dialog')
        .hasClass('modal-dialog--hiding', 'has a class whilst hiding');

      await waitForAnimation('.modal-dialog');

      assert.verifySteps(
        ['close'],
        'close action is fired after the hide animation'
      );
    });

    test('callback close', async function (assert) {
      assert.expect(3);

      let api;

      this.ready = (modal) => (api = modal);
      this.close = () => assert.step('close');

      await render(hbs`
        <ModalDialog
          @onReady={{this.ready}}
          @onClose={{this.close}} as |modal|>
          <button type="button" {{on "click" modal.close}}>Close</button>
        </ModalDialog>
      `);

      api.close();

      await settled();

      assert
        .dom('.modal-dialog')
        .hasClass('modal-dialog--hiding', 'has a class whilst hiding');

      await waitForAnimation('.modal-dialog');

      assert.verifySteps(
        ['close'],
        'close action is fired after the hide animation'
      );
    });

    test('missing close argument', async function (assert) {
      assert.expect(1);

      await render(hbs`
        <ModalDialog @onClose={{null}} as |modal|>
          <button type="button" {{on "click" modal.close}}>Close</button>
        </ModalDialog>
      `);

      await click('button');

      await waitForAnimation('.modal-dialog');

      assert.ok(true, 'does not blow up if onClose is not a function');
    });

    test('box element', async function (assert) {
      assert.expect(1);

      await render(hbs`
        <ModalDialog as |modal|>
          {{capture modal}}
        </ModalDialog>
      `);

      assert.deepEqual(
        this.captured.boxElement,
        find('.modal-dialog__box'),
        'exposes the modal dialog box element via the yielded api'
      );
    });
  });

  module('escaping', function () {
    // Modal dialogs that do not close when escape is pressed add a class name
    // to the modal, so you can add a suitable animation to inform the user
    // that their action was denied. This is useful for preventing accidental
    // data loss, if a user has entered text into a modal, then hits escape
    // without pressing Save for example.

    test('allowed', async function (assert) {
      assert.expect(2);

      this.close = () => assert.step('close');

      await render(hbs`
        <ModalDialog
          @escapable={{true}}
          @onClose={{this.close}} />
      `);

      await triggerKeyEvent('.modal-dialog', 'keyup', 27); // Escape

      await waitForAnimation('.modal-dialog');

      assert.verifySteps(
        ['close'],
        'escapable modal dialogs will close when escape is pressed'
      );
    });

    test('not allowed', async function (assert) {
      assert.expect(3);

      this.close = () => assert.step('close');

      await render(hbs`
        <ModalDialog @onClose={{this.close}} />
      `);

      await triggerKeyEvent('.modal-dialog', 'keyup', 27); // Escape

      assert
        .dom('.modal-dialog')
        .hasClass(
          'modal-dialog--warning',
          'when the user presses escape the modal dialog has a warning class'
        );

      await waitForAnimation('.modal-dialog');

      assert
        .dom('.modal-dialog')
        .doesNotHaveClass(
          'modal-dialog--warning',
          'class removed after animation has finished'
        );

      assert.verifySteps([], 'close action is not fired');
    });
  });

  test('height', async function (assert) {
    // You may wonder why this is needed / useful.
    //
    // Consider a modal dialog that fits in the viewport, and has content
    // inside it, that overflows outside the modal.
    // For example: a dropdown menu.
    //
    // You would not want any overflow css rules, so that dropdown does not
    // get cut off when opened.
    //
    // Then consider a modal dialog that is too tall for the viewport, now you
    // will want to add scrollbars to the modal for it to remain useful.
    //
    // The dropdown menu will now open 'inside' the scrollable modal dialog,
    // rather than overflowing outside it.
    //
    // Note that this general problem is also solvable by rendering the dropdown
    // elsewhere in the DOM (aka 'wormhole'), but this is not always possible.

    assert.expect(2);

    const fakeDocumentElement = {
      clientHeight: 100
    };

    class TestModalDialogComponent extends ModalDialogComponent {
      constructor() {
        super(...arguments);
        this.documentElement = fakeDocumentElement;
      }
    }

    this.owner.register('component:modal-dialog', TestModalDialogComponent);

    await render(hbs`
      {{! template-lint-disable no-inline-styles }}
      <ModalDialog>
        {{#if this.makeTooTall}}
          <div style="height: 100px">I'm too tall</div>
        {{else}}
          <div style="height: 99px">I'm OK</div>
        {{/if}}
      </ModalDialog>
    `);

    assert
      .dom('.modal-dialog')
      .doesNotHaveClass(
        'modal-dialog--too-tall',
        'does not have a class name when the modal dialog box fits in the window'
      );

    this.set('makeTooTall', true);

    await settled();

    assert
      .dom('.modal-dialog')
      .hasClass(
        'modal-dialog--too-tall',
        'has a class name when the modal dialog box does not fits in the window'
      );
  });

  module('body scroll lock', function () {
    test('third party addon is installed', async function (assert) {
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

  module('focus trap', function (hooks) {
    // We specifically use keydown and not keyup,
    // because keyup, is too late to prevent default.

    hooks.beforeEach(async function () {
      await render(hbs`
        <button type="button" class="external"></button>

        <ModalDialog>
          <button type="button" class="first"></button>
          <button type="button" class="second"></button>
          <button type="button" class="third"></button>
        </ModalDialog>
     `);
    });

    test('tabbing forwards', async function (assert) {
      assert.expect(1);

      await focus('.third');
      await triggerKeyEvent('.modal-dialog', 'keydown', 9); // Tab

      assert.deepEqual(
        find('.first'),
        document.activeElement,
        'loops back to the beginning and focuses the first element'
      );
    });

    test('tabbing backwards', async function (assert) {
      assert.expect(1);

      await focus('.first');
      await triggerKeyEvent('.modal-dialog', 'keydown', 9, { shiftKey: true }); // Tab

      assert.deepEqual(
        find('.third'),
        document.activeElement,
        'loops back to the end and focuses the last element'
      );
    });
  });
});
