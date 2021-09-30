import { find } from '@ember/test-helpers';
import { waitForAnimation } from '@zestia/animation-utils';

export default function (selector, propertyName) {
  const element = typeof selector === 'string' ? find(selector) : selector;

  return waitForAnimation(element, propertyName);
}
