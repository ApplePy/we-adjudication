import Ember from 'ember';

export default Ember.Component.extend({
   store: Ember.inject.service(),
  award: null,
  awards: null,
  updateAward: null,
  awardToDel: null,

 actions: {
  deleteAward(award) {
      this.set('awardToDel', award);
    this.set('awards', this.get('awards').without(this.get('awardToDel')));
    this.get('store').findRecord('award', this.get('awardToDel').get('id'), { backgroundReload: false }).then(function(award) {
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
