import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  notDONE: null,
  newTermName: null,
  student: null,

  actions: {
    saveRecord(){
      var term = this.get('store').createRecord('term-code', {
        name: this.get('newTermName'),
        student: this.get('student')
      });

      var self = this;
      term.save().then(function(record){

      });

      this.set('notDONE', false);
      Ember.$('.ui.modal').modal('hide');
      Ember.$('.ui.modal').remove();
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
