# @zestia/ember-modal-dialog

<a href="https://badge.fury.io/js/%40zestia%2Fember-modal-dialog"><img src="https://badge.fury.io/js/%40zestia%2Fember-modal-dialog.svg" alt="npm version" height="18"></a> &nbsp; <a href="http://travis-ci.org/zestia/ember-modal-dialog"><img src="https://travis-ci.org/zestia/ember-modal-dialog.svg?branch=master"></a> &nbsp; <a href="https://david-dm.org/zestia/ember-modal-dialog#badge-embed"><img src="https://david-dm.org/zestia/ember-modal-dialog.svg"></a> &nbsp; <a href="https://david-dm.org/zestia/ember-modal-dialog#dev-badge-embed"><img src="https://david-dm.org/zestia/ember-modal-dialog/dev-status.svg"></a> &nbsp; <a href="https://emberobserver.com/addons/@zestia/ember-modal-dialog"><img src="https://emberobserver.com/badges/-zestia-ember-modal-dialog.svg"></a>

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
