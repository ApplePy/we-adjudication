import Ember from 'ember';

export default Ember.Component.extend({
    newrecipient: null,
    store: Ember.inject.service(),
  studentsModel: null,
  INDEX: null,
  studentID: null,
  notDONE: null,
  //student: null,

 actions: {
  saveAward() {
     var award = this.get('store').createRecord('award', {
      note: this.get('newnote'),
      recipient: this.get('newrecipient')
      });

      award.save();
/*
   var index = this.get('studentsModel').indexOf(newrecipient);
     this.set('INDEX', index);

    this.set('notDONE', false);
     Ember.$('.ui.modal').modal('hide');
     Ember.$('.ui.modal').remove();

      this.get('store').query('student', {filter: {number: this.get('studentID')}}).then(
       (result) => {
         var index = this.get('studentsModel').indexOf(result);
         this.set('INDEX', index);
         this.set('notDONE', false);
         Ember.$('.ui.modal').modal('hide');
         Ember.$('.ui.modal').remove();
       }
     ).catch((err)=>{
       alert("Invalid student number!");
     }); */
    
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
