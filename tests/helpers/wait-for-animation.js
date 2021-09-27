import { Promise } from 'rsvp';
import { find, waitFor } from '@ember/test-helpers';

export default async function waitForAnimation(selector, animationName) {
  await waitFor(selector);

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
