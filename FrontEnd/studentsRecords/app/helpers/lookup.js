import Ember from 'ember';

export function lookup(params/*, hash*/) {
  let array = params[0];
  let index = params[1];
  return array[index];
}

export default Ember.Helper.helper(lookup);
