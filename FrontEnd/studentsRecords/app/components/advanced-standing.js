import Ember from 'ember';

export default Ember.Component.extend({
    recipient: null,
    standing: null,
    store: Ember.inject.service(),
  
 actions: {
  deleteStanding() {
    this.get('store').findRecord('advanced-standing', this.get('standing').id, { backgroundReload: false }).then(function(standing) {
        standing.deleteRecord();
        standing.get('isDeleted');
        standing.save();
      });
  },

  updateStanding() {
   // alert("1 "+ this.get('standing.course'));
    this.get('store').findRecord('advanced-standing', this.get('standing').id).then((standing) => {
        standing.set('course', this.get('standing.course'));
        standing.set('description', this.get('standing.description'));
        standing.set('units', this.get('standing.units'));
        standing.set('grade', this.get('standing.grade'));
        standing.set('from', this.get('standing.from'));
        standing.save();
      });
      
  }
 }
});
