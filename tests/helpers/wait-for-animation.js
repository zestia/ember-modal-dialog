import { Promise } from 'rsvp';
import { find } from '@ember/test-helpers';

export default function waitForAnimation(selector, animationName) {
  const el = typeof selector === 'string' ? find(selector) : selector;

  return new Promise((resolve) => {
    function handler(event) {
      if (el === event.target && animationName === event.animationName) {
        el.removeEventListener('animationend', handler);
        resolve();
      }
    }

    el.addEventListener('animationend', handler);
  });
}
