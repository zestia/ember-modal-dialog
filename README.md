# @zestia/ember-modal-dialog

<p>
  <!--
  <a href="https://github.com/zestia/ember-modal-dialog/actions/workflows/ci.yml">
    <img src="https://github.com/zestia/ember-modal-dialog/actions/workflows/ci.yml/badge.svg">
  </a>
  -->

  <a href="https://david-dm.org/zestia/ember-modal-dialog#badge-embed">
    <img src="https://david-dm.org/zestia/ember-modal-dialog.svg">
  </a>

  <a href="https://david-dm.org/zestia/ember-modal-dialog#dev-badge-embed">
    <img src="https://david-dm.org/zestia/ember-modal-dialog/dev-status.svg">
  </a>

  <a href="https://emberobserver.com/addons/@zestia/ember-modal-dialog">
    <img src="https://emberobserver.com/badges/-zestia-ember-modal-dialog.svg">
  </a>

  <img src="https://img.shields.io/badge/Ember-%3E%3D%203.16-brightgreen">
</p>

This addon provides a simple Modal Dialog component.

## Installation

```
ember install @zestia/ember-modal-dialog
```

## Demo

https://zestia.github.io/ember-modal-dialog/

## Features

- Focus Trap ✔︎
- Body Scroll Lock ✔︎
- Class names for animating ✔︎
- Loading state handling ✔︎
- Optionally escapable ✔︎
- Root element notification ✔︎
- Simple API ✔︎

## Notes

- This addon intentionally does not come with any styles.

## Example

The modal dialog component isn't designed to be used on its own, but rather used to compose a new modal dialog component... in this example it's called "my-modal"

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

```handlebars
{{! my-modal.hbs }}
<ModalDialog
  @onClose={{@onClose}}
  @onLoad={{@onFetchPerson}}
  @onLoaded={{this.loaded}}
  @onLoadError={{this.failedToLoad}} as |modal|
>
  <modal.Header>
    Welcome
  </modal.Header>

  <modal.Content>
    {{#if modal.isLoading}}
      Loading person…
    {{else if this.loadingError}}
      Unable to load person because {{this.loadingError}}
    {{else}}
      Hello {{this.person.name}}
    {{/if}}
  </modal.Content>

  <modal.Footer>
    <button {{on "click" modal.close}}>
      Close
    </button>
  </modal.Footer>
</ModalDialog>
```

```javascript
// application/route.js
export default class ApplicationRoute extends Route {
  @action
  loadPerson() {
    // Fetch remote data
  }
}
```

```handlebars
{{! application/route.hbs }}
{{#if this.showMyModal}}
  <MyModal
    @onClose={{this.hideMyModal}}
    @onFetchPerson={{fn this.loadPerson 123}}
  />
{{/if}}
```
