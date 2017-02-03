import Ember from 'ember';

export default Ember.Component.extend({
  notDone: null,
  toDelete: null,
  studentsModel: null,

  actions: {
    cancel: function () {
      this.set('notDone', false);
      Ember.$('.ui.modal').modal('hide');
      Ember.$('.ui.modal').remove();
    },
    confirm: function(){
      this.set('notDone', false);
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
