import Ember from 'ember';

export default Ember.Route.extend({
  store: Ember.inject.service(),

  model: function(params) {
    return this.get('store').findRecord('student', params.student_id);
  },
});
