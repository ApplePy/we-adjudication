import Ember from 'ember';

export default Ember.Component.extend({
  notDONE: null,
  newTermName: null,

  actions: {
    saveRecord(){
    //create a new term with term name
    },

    close(){
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
