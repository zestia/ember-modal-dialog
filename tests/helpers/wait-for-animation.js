import { find } from '@ember/test-helpers';
import { waitForAnimation } from '@zestia/animation-utils';

export default async function (selector, options) {
  const element = typeof selector === 'string' ? find(selector) : selector;

  const animations = await waitForAnimation(element, options);

  if (animations.length < 1) {
    throw new Error('No animations performed');
  }
}
