import Ember from 'ember';

export default Ember.Component.extend({
    recipient: null,
    standing: null,
    store: Ember.inject.service(),
    descriptionShow: null,
    updateCourse: null,
    standings: null,

 actions: {
  deleteStanding() {
    this.set('standings', this.get('standings').without(this.get('standing')));
    this.get('store').findRecord('advanced-standing', this.get('standing').id, { backgroundReload: false }).then(function(standing) {
        standing.deleteRecord();
        standing.get('isDeleted');
        standing.save();
      });
  },

  updateStanding() {
       this.set('updateCourse', true);
  },

  showDescription() {
    this.set('descriptionShow', true);
  },
 }
});
