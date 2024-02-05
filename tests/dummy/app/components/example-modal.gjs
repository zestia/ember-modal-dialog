/* https://github.com/ember-cli/eslint-plugin-ember/issues/2035 */
/* eslint-disable no-unused-expressions */

import ModalDialog from '@zestia/ember-modal-dialog/components/modal-dialog';
import autoFocus from '@zestia/ember-auto-focus/modifiers/auto-focus';
import LoremIpsumShort from 'dummy/components/lorem-ipsum-short';
import { on } from '@ember/modifier';

<template>
  <ModalDialog
    @escapable={{@escapable}}
    @onClose={{@onClose}}
    @onLoad={{@onLoad}}
    as |modal|
  >
    {{#if modal.isLoading}}
      <p>Please wait...</p>
    {{else}}
      <input
        aria-label="Example input"
        type="text"
        placeholder="Example input"
        {{autoFocus}}
      />

      <div class="example-text">
        <LoremIpsumShort />
      </div>

      <button type="button" {{on "click" modal.close}}>
        Close
      </button>
    {{/if}}
  </ModalDialog>
</template>
