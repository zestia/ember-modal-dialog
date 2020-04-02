import { find } from '@ember/test-helpers';
import { Promise } from 'rsvp';

export default function waitForAnimation(selector) {
  return new Promise((resolve) => {
    find(selector).addEventListener('animationend', resolve, { once: true });
  });
}
