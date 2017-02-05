import Ember from 'ember';

export default Ember.Component.extend({
   store: Ember.inject.service(),
  award: null,
 actions: {
  deleteAward() {
    //alert(this.get('award').id);
    this.get('store').findRecord('award', this.get('award').id, { backgroundReload: false }).then(function(award) {
        award.deleteRecord();
        award.get('isDeleted');
        award.save();
      });
  },

   updateAward() {
   // alert("1 "+ this.get('standing.course'));
    this.get('store').findRecord('award', this.get('award').id).then((award) => {
        award.set('note', this.get('award.note'));
        award.save();
      });
      
  }
 }
});
