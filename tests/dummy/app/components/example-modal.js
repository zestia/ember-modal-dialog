import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ExampleModalComponent extends Component {
  @tracked showMoreContent = false;

  @action
  addMoreContent() {
    this.showMoreContent = true;
  }
}
