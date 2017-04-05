import Ember from 'ember';

export default Ember.Component.extend({
    recipient: null,
    standingToDel: null,
    store: Ember.inject.service(),
    descriptionShow: null,
    updateCourse: null,
    standings: null,
    advancedStanding: [],

 actions: {
  deleteStanding(stand) {
    this.set('standingToDel', stand);
    this.set('standings', this.get('standings').without(this.get('standingToDel')));
    this.get('store').findRecord('advanced-standing', this.get('standingToDel').get('id'), { backgroundReload: false }).then(function(standing) {
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
  }
 }
});