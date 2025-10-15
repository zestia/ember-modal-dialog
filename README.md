# @zestia/ember-modal-dialog

<!-- [![Ember Observer][ember-observer-badge]][ember-observer-url] -->
<!-- [![GitHub Actions][github-actions-badge]][github-actions-url] -->

[npm-badge]: https://img.shields.io/npm/v/@zestia/ember-modal-dialog.svg
[npm-badge-url]: https://www.npmjs.com/package/@zestia/ember-modal-dialog
[github-actions-badge]: https://github.com/zestia/ember-modal-dialog/workflows/CI/badge.svg
[github-actions-url]: https://github.com/zestia/ember-modal-dialog/actions
[ember-observer-badge]: https://emberobserver.com/badges/-zestia-ember-modal-dialog.svg
[ember-observer-url]: https://emberobserver.com/addons/@zestia/ember-modal-dialog

This addon provides a simple Modal Dialog component.

There are two versions [4x](https://github.com/zestia/ember-modal-dialog/blob/4x/README.md) and [5x](https://github.com/zestia/ember-modal-dialog/blob/main/README.md).

Version 5 uses the native dialog, and version 4 does not. Version 4 is still being maintained because support for native dialog is not great, and there are still some [quirks](#notes).

## Installation

```
ember install @zestia/ember-modal-dialog
```

Add the following to `~/.npmrc` to pull @zestia scoped packages from Github instead of NPM.

```
@zestia:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=<YOUR_GH_TOKEN>
```

## Demo

https://zestia.github.io/ember-modal-dialog

## Features

- Focus trap ✔︎
- Body scroll lock ✔︎
- Loading state handling ✔︎
- Optionally escapable ✔︎
- Exceeds viewport detection ✔︎
- Animatable (includes test waiters) ✔︎
- Simple API ✔︎

## Notes

- This addon intentionally does not come with any styles.
- It is configured with [ember-test-waiters](https://github.com/emberjs/ember-test-waiters) so `await`ing in your test suite will just work.
- Does not use native `dialog` _yet_, because:
  - Can't animate `::backdrop`
  - Can't use `::backdrop` with CSS variables
  - Does not provide a focus trap
  - Does not provide a scroll lock

## Example

The modal dialog component isn't designed to be used on its own, but rather used to compose a new modal dialog component... in this example it's called "my-modal"

```handlebars
{{! my-modal.hbs }}
<ModalDialog @onClose={{@onClose}} as |modal|>
  Content

  <button {{on 'click' modal.close}}>
    Close
  </button>
</ModalDialog>
```

```handlebars
{{! application/template.hbs }}
{{#if this.showMyModal}}
  <MyModal @onClose={{this.hideMyModal}} />
{{/if}}
```

## `ModalDialog`

### Arguments

#### `@onReady`

Optional. This action receives the API as a parameter, for full control over a modal dialog.

#### `@onLoad`

Optional. Fired when a modal is constructed and allows you to return a promise for any data that is required before the modal can display.

#### `@onLoaded`

Optional. Fired after the request to load data was successful. Receives the result as a parameter.

#### `@onLoadError`

Optional. Fired when the request to load data fails. Receives the error as a parameter.

#### `@onClose`

Required. This action fires when `close` has been called, _and_ any animations have run to hide the modal dialog.

#### `@onEscape`

Optional. Fired when escape is pressed or the user clicks outside the dialog box. You can use the API to call `close` for example.

### API

#### `close`

Call this when you want to close the modal. It will first wait for any animations on the DOM element, and then `@onClose` will be fired. Allowing you to physically remove the modal from the DOM.

#### `isLoading`

Whether the data required for the modal dialog to display is loading.

#### `element`

The DOM element of the modal dialog component.

#### `boxElement`

The inner DOM element of the modal dialog component, that contains the content.
