import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class ExampleModalComponent extends Component {
  @tracked showMoreContent = false;

  addMoreContent = () => {
    this.showMoreContent = true;
  };
}
