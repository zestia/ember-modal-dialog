import Controller from '@ember/controller';
import { action, set } from '@ember/object';

export default class ApplicationController extends Controller {
  showTestModal = false;

  @action
  openTestModal() {
    set(this, 'showTestModal', true);
  }

  @action
  closeTestModal() {
    set(this, 'showTestModal', false);
  }
}
