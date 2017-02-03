import Ember from 'ember';

export default Ember.Component.extend({
  notDONE: null,
  toDelete: null,
  studentsModel: null,

  actions: {
    //Gets rid of the modal
    cancel: function () {
      this.set('notDONE', false);
      Ember.$('.ui.modal').modal('hide');
      Ember.$('.ui.modal').remove();
    },

    //Calls the action defined by onConfirm in student-data-entry template
    confirm: function(){
      this.get('onConfirm')();
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
