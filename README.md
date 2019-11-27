# @zestia/ember-modal-dialog

This addon provides a simple Modal Dialog component.

When rendered will display in an top level DOM element, rather than in-place.

The component can be animated in and out using class names that are added to the element during its set up and tear down phase.

Additionally, it can be set into a loading state which is useful if the modal dialog needs to wait for some data before it can display.

## Installation

```
ember install @zestia/ember-modal-dialog
```

## Notes

- This addon intentionally does not come with any styles.

## Example

The modal dialog component isn't designed to be used on its own, but rather wrapped with a parent component.

```javascript
// my-modal/component.js
export default class MyModal extends Component {
  @action loaded(person) {
    set(this, 'person', person);
  }

  @action failedToLoad(error) {
    set(this, 'loadingError', error.message);
  }
}
```

```handlebars
{{! my-modal/template.hbs }}
<ModalDialog
  @onClose={{@onClose}}
  @onLoad={{@onLoad}}
  @onLoaded={{this.loaded}}
  @onLoadError={{this.failedToLoad}} as |modal|>
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
    <button {{on "click" modal.close}}>Close</button>
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
    @onLoad={{fn this.loadPerson 123}} />
{{/if}}
```
