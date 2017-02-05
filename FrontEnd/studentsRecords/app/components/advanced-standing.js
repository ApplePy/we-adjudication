import Ember from 'ember';

export default Ember.Component.extend({
    /*course: null,
    unit: null,
    description: null,
    grade: null,
    from: null, */
    recipient: null,
    standing: null,
     store: Ember.inject.service(),
  
 actions: {
  deleteStanding() {
    //alert(this.get('award').id);
    this.get('store').findRecord('advanced-standing', this.get('standing').id, { backgroundReload: false }).then(function(standing) {
        standing.deleteRecord();
        standing.get('isDeleted');
        standing.save();
      });
  }
 }
});
