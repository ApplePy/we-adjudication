import Ember from 'ember';

export default Ember.Component.extend({
    updateaward: null,
    notDONE: null,
    store: Ember.inject.service(),

    actions: {
      saveAward() {
        this.get('store').findRecord('award', this.get('updateaward').id).then((award) => {
        award.set('note', this.get('updateaward.note'));
        award.save();

         this.set('notDONE', false);
     Ember.$('.ui.modal').modal('hide');
     Ember.$('.ui.modal').remove();
      });
  },

   close: function() {
    this.set('notDONE', false);
     Ember.$('.ui.modal').modal('hide');
     Ember.$('.ui.modal').remove();
     this.get('updateaward').rollbackAttributes();
    }
   },

 didRender() {
    Ember.$('.ui.modal')
      .modal({
        closable: false,
      })
      .modal('show');
  }
});
