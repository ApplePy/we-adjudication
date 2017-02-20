import Ember from 'ember';

export default Ember.Component.extend({
    title: null,
    description: null,
    notDONE: null,
  //  store: Ember.inject.service(),

    actions: {
   close: function() {
    this.set('notDONE', false);
     Ember.$('.ui.modal').modal('hide');
     Ember.$('.ui.modal').remove();
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
