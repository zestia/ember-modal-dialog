# Changelog

## 4.7.0

- Convert to v2 addon

## 4.6.0

- Swap parameter order to `@onEscape`
- Provide API as second parameter on `@onLoaded` and `@onLoadError`

## 4.5.5

- Update `@ember/test-waiters`

## 4.5.4

- Convert to `.gjs`
- Run ember-cli-update
- Upgrade dependencies

## 4.5.3

- Run ember-cli-update
- Upgrade dependencies
- Convert tests to `.gjs`

## 4.5.2

- Update `@zestia` scoped packages

## 4.5.1

- Re-release of 4.5.0 but published to GH Packages instead of NPM

## 4.5.0

- Run `ember-cli-update`

## 4.4.1

- Add fix & regression test for 4.4.0 which would hang when closing in some circumstances

## 4.4.0

- Removes `has-modal` class name from root element (use `:has` instead or a polyfill)
- Updates animation utils

## 4.3.0

- Remove BEM classes in favour of data attributes

## 4.2.0

- Ember Auto Import 2x
- Upgrade dependencies
- Run ember-cli-update
- Fix backtrack deprecation

## 4.1.4

- Remove `tabindex="0"` from the modal.

## 4.1.3

- When body scroll lock is enabled, only allow scrolling on _scrollable_ children, not all children of the modal.
- Remove `@ember/render-modifiers` [#17](https://github.com/zestia/ember-modal-dialog/issues/17)

## 4.1.2

- Fix: Remove event listener in teardown [#15](https://github.com/zestia/ember-modal-dialog/pull/15)

## 4.1.1

- Fix: Allow auto focusing of child elements

## 4.1.0

- Add support for nested modals

## 4.0.0

- Release changes from 4.0.0-beta

## 4.0.0-beta.1

- Fix body scroll lock on mobile devices

## 4.0.0-beta.0

- Change: The modal dialog box is now focused initially
- Change: The exceeds viewport class is now on the modal dialog box
- Removed: Header, Content and Footer components
- Removed: Warning class name
- Removed: `@escapable`
- Added `@onEscape`

## 3.3.4

- Bump `@zestia/animation-utils`

## 3.3.3

- Remove blur listener

## 3.3.2

- When the window is focused, restore focus to the last focused element inside the modal

## 3.3.1

- Bump `@zestia-animation-utils`

## 3.3.0

- Utilise `@zestia/animation-utils`
- Upgrade dependencies

## 3.2.2

- Add debug label to test waiter

## 3.2.1

- Clear animation deferred once used

## 3.2.0

- The close action uses a test waiter, and so is aware of the hide animation.

## 3.1.0

- Release changes from 3.1.0-beta.0

## 3.1.0-beta.0

- Focus the first focusable element inside the modal, or the modal itself, when window is focused. [#7](https://github.com/zestia/ember-modal-dialog/issues/7)

## 3.0.0

- Change `modal-dialog--too-tall` class name to `modal-dialog--exceeds-viewport`
- Make exceeds viewport detection re-compute on window resize
- Fix focus trap including disabled elements [#6](https://github.com/zestia/ember-modal-dialog/issues/6)

## 2.3.4

- Fix simultaneous animations

## 2.3.3

- Upgrade dependencies

## 2.3.2

- Simplify waiting for animation
- Fix holding down the mouse, dragging outside the modal dialog box, and releasing

## 2.3.1

- Add `contenteditable="true"` support for focus trap

## 2.3.0

- Upgrade dependencies
- Add Embroider support
- Restore focus to the element that had it, after the modal has closed

## 2.2.8

- Upgrade dependencies

## 2.2.7

- Upgrade dependencies
- Run ember-cli-update

## 2.2.6

- Upgrade dependencies

## 2.2.5

- Upgrade dependencies

## 2.2.4

- Upgrade dependencies

## 2.2.3

- Expose modal dialog box element via the yielded API

## 2.2.2

- Upgrade dependencies

## 2.2.1

- Upgrade dependencies

## 2.2.0

- Unpublished (contained a breaking change)

## 2.1.2

- Add focus trap

## 2.1.1

- Set body-scroll-lock's reserveScrollBarGap to true
- Make sure the dialog box can be scrolled on touch devices

## 2.1.0

- Add body-scroll-lock

## 2.0.1

- Upgrade dependencies

## 2.0.0

- Glimmerise component
- Drop support for Ember < 3.16

## 1.0.6

- Upgrade dependencies

## 1.0.5

- Splat attributes on header, content and footer components
- Upgrade dependencies

## 1.0.4

- Move `@onLoad` action from did insert hook to component initialisation hook

## 1.0.3

- More resiliant if argument actions are not functions

## 1.0.2

- Upgrade dependencies

## 1.0.1

- npm audit fix

## 1.0.0

- Initial release
