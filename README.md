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

```handlebars
{{#if this.showModal}}
  <ModalDialog @onClose={{this.hideModal}} @onLoad={{this.loadPerson}} as |modal|>
    <modal.Header>
      Welcome
    </modal.Header>
    <modal.Content>
      Hello {{this.person.name}}
    </modal.Content>
    <modal.Footer>
      <button {{on "click" modal.close}}>Close</button>
    </modal.Footer>
  </ModalDialog>
{{/if}}
```
