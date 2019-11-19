import { find } from '@ember/test-helpers';
import { Promise } from 'rsvp';

export default function waitForTransition(selector) {
  return new Promise(resolve => {
    find(selector).addEventListener('transitionend', resolve, { once: true });
  });
}
