# @zestia/ember-modal-dialog

[![Latest npm release][npm-badge]][npm-badge-url]
[![GitHub Actions][github-actions-badge]][github-actions-url]
[![Ember Observer][ember-observer-badge]][ember-observer-url]

[npm-badge]: https://img.shields.io/npm/v/@zestia/ember-modal-dialog.svg
[npm-badge-url]: https://www.npmjs.com/package/@zestia/ember-modal-dialog
[github-actions-badge]: https://github.com/zestia/ember-modal-dialog/workflows/CI/badge.svg
[github-actions-url]: https://github.com/zestia/ember-modal-dialog/actions
[ember-observer-badge]: https://emberobserver.com/badges/-zestia-ember-modal-dialog.svg
[ember-observer-url]: https://emberobserver.com/addons/@zestia/ember-modal-dialog

This addon provides a simple Modal Dialog component.

## Installation

```
ember install @zestia/ember-modal-dialog
```

## Demo

https://zestia.github.io/ember-modal-dialog/

## Features

- Focus trap ✔︎
- Body scroll lock ✔︎
- Loading state handling ✔︎
- Optionally escapable ✔︎
- Root element notification ✔︎
- Exceeds viewport detection ✔︎
- Animatable (includes test waiters) ✔︎
- Simple API ✔︎

## Notes

- This addon intentionally does not come with any styles.
- Does not use native `dialog` yet, because:
  - Can't animate `::backdrop`
  - Can't use `::backdrop` with CSS variables
  - Does not provide a focus trap
  - Does not provide a scroll lock

## Example

The modal dialog component isn't designed to be used on its own, but rather used to compose a new modal dialog component... in this example it's called "my-modal"

```handlebars
{{! my-modal.hbs }}
<ModalDialog
  @onClose={{@onClose}}
  @onEscape={{@onEscape}}
  @onLoad={{@onFetchPerson}}
  @onLoaded={{this.loaded}}
  @onLoadError={{this.failedToLoad}}
  as |modal|
>
  {{#if modal.isLoading}}
    Loading person…
  {{else if this.loadingError}}
    Unable to load person because
    {{this.loadingError}}
  {{else}}
    Hello
    {{this.person.name}}
  {{/if}}

  <button {{on 'click' modal.close}}>
    Close
  </button>
</ModalDialog>
```

```javascript
// my-modal.js
export default class MyModal extends Component {
  @tracked person;
  @tracked loadingError;

  @action
  loaded(person) {
    this.person = person;
  }

  @action
  failedToLoad(error) {
    this.loadingError = error.message;
  }
}
```

```javascript
// application/controller.js
export default class ApplicationController extends Controller {
  @action
  loadPerson() {
    // Fetch remote data
  }

  @action
  confirmEscape() {
    return confirm('Are you sure?');
  }
}
```

```handlebars
{{! application/template.hbs }}
{{#if this.showMyModal}}
  <MyModal
    @onClose={{this.hideMyModal}}
    @onEscape={{this.confirmEscape}}
    @onFetchPerson={{fn this.loadPerson 123}}
  />
{{/if}}
```
