import Ember from 'ember';

export default Ember.Component.extend({
   store: Ember.inject.service(),
  award: null,
  awards: null,
  updateAward: null,

 actions: {
  deleteAward() {
    this.set('awards', this.get('awards').without(this.get('award')));
    this.get('store').findRecord('award', this.get('award').id, { backgroundReload: false }).then(function(award) {
        award.deleteRecord();
        award.get('isDeleted');
        award.save();
      });
  },

   updateAward() {
       this.set('updateAward', true);
  }

 }
});
