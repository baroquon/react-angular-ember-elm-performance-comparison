import Ember from 'ember';

export function eq([val1, val2]) {
  return val1===val2;
}

export default Ember.Helper.helper(eq);
