import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  notDONE: null,
  newName: null,
  newCode: null,
  codes: null,

 actions: {
  saveNewCode() {
     var code = this.get('store').createRecord('assessment-code', {
      name: this.get('newName'),
      code: this.get('newCode')
      });

     var self = this;
      code.save().then(function(record){
      self.get('codes').pushObject(record);
      });

    this.set('notDONE', false);
    Ember.$('.ui.modal').modal('hide');
    Ember.$('.ui.modal').remove();

  },

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
