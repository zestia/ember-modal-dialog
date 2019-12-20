import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import ModalDialogComponent from '@zestia/ember-modal-dialog/components/modal-dialog/component';
import waitForAnimation from '../../helpers/wait-for-animation';
import { reject, defer } from 'rsvp';
import { render, settled, triggerKeyEvent, click } from '@ember/test-helpers';

module('modal-dialog', function(hooks) {
  setupRenderingTest(hooks);

  module('rendering', function() {
    test('it works', async function(assert) {
      assert.expect(7);

      await render(hbs`
        <ModalDialog class="test-modal" as |modal|>
          <modal.Header>
            Header goes here
          </modal.Header>

          <modal.Content>
            Content goes here
          </modal.Content>

          <modal.Footer>
            Footer goes here
          </modal.Footer>
        </ModalDialog>
      `);

      assert
        .dom('.modal-dialog')
        .hasClass('modal-dialog--showing', 'showing by default');

      assert.dom('.modal-dialog').hasAttribute('role', 'dialog');

      assert.dom('.modal-dialog').hasAttribute('aria-modal', 'true');

      assert
        .dom('.modal-dialog')
        .isFocused('is focused to respond the keyboard');

      assert.dom('.modal-dialog__header').exists('can render the header');

      assert.dom('.modal-dialog__header').exists('can render the content');

      assert.dom('.modal-dialog__header').exists('can render the footer');
    });

    test('root element', async function(assert) {
      // It's useful to inform the root element that a modal dialog is present
      // in the DOM, because you may wish to add styles to prevent document
      // scrolling or blur the background for example.

      assert.expect(2);

      await render(hbs`
        {{#if this.show}}
          <ModalDialog class="test-modal" />
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
  });

  module('loading', function() {
    test('success', async function(assert) {
      assert.expect(4);

      const deferred = defer();

      this.set('load', () => deferred.promise);
      this.set('loaded', data => this.set('name', data));

      await render(hbs`
        <ModalDialog
          class="test-modal"
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

    test('failure', async function(assert) {
      assert.expect(2);

      this.set('load', () => reject({ message: 'sorry' }));
      this.set('loadError', error => this.set('error', error));

      await render(hbs`
        <ModalDialog class="test-modal" @onLoad={{this.load}} @onLoadError={{this.loadError}}>
          {{#if this.error}}
            Failed {{this.error.message}}
          {{/if}}
        </ModalDialog>
      `);

      await settled();

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

  module('api', function() {
    test('yielded close', async function(assert) {
      assert.expect(3);

      this.close = () => assert.step('close');

      await render(hbs`
        <ModalDialog class="test-modal" @onClose={{this.close}} as |modal|>
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

    test('callback close', async function(assert) {
      assert.expect(3);

      let api;

      this.ready = modal => (api = modal);
      this.close = () => assert.step('close');

      await render(hbs`
        <ModalDialog
          class="test-modal"
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
  });

  module('escaping', function() {
    // Modal dialogs that do not close when escape is pressed add a class name
    // to the modal, so you can add a suitable animation to inform the user
    // that their action was denied. This is useful for preventing accidental
    // data loss, if a user has entered text into a modal, then hits escape
    // without pressing Save for example.

    test('allowed', async function(assert) {
      assert.expect(2);

      this.close = () => assert.step('close');

      await render(hbs`
        <ModalDialog
          class="test-modal"
          @escapable={{true}}
          @onClose={{this.close}} />
      `);

      await triggerKeyEvent('.modal-dialog', 'keydown', 27);

      await waitForAnimation('.modal-dialog');

      assert.verifySteps(
        ['close'],
        'escapable modal dialogs will close when escape is pressed'
      );
    });

    test('not allowed', async function(assert) {
      assert.expect(3);

      this.close = () => assert.step('close');

      await render(hbs`
        <ModalDialog class="test-modal" @onClose={{this.close}} />
      `);

      await triggerKeyEvent('.modal-dialog', 'keydown', 27);

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

  test('height', async function(assert) {
    // You may wonder why this is needed / useful.
    //
    // Consider a modal dialog that fits in the viewport, and has content
    // inside it, that overflows outside the modal.
    // For example: a dropdown menu.
    //
    // You would not want any overflow css rules, so that dropdown does not
    // get cut off.
    //
    // Then consider a modal dialog that is too tall for the viewport, now you
    // will want to add scrollbars to the modal for it to remain useful.
    //
    // It's now ok to add overflow css rules, the dropdown menu will now open
    // 'inside' the modal dialog, rather than overflowing outside it.
    //
    // Note that this general problem is also solvable by rendering the dropdown
    // elsewhere in the DOM, but this is not always possible.

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
});
