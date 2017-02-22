import Ember from 'ember';

export default Ember.Component.extend({
    newrecipient: null,
    store: Ember.inject.service(),
  studentsModel: null,
  INDEX: null,
  studentID: null,
  notDONE: null,
  awards: null,

 actions: {
  saveAward() {
     var award = this.get('store').createRecord('award', {
      note: this.get('newnote'),
      recipient: this.get('newrecipient')
      });

     var self = this;
      award.save().then(function(record){
        self.get('awards').pushObject(record);
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
