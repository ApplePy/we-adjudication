import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  studentsModel: null,
  INDEX: null,
  studentID: null,
  notDONE: null,
  student: null,

 actions: {
    find: function () {
      var studentID = this.get('studentID');

     this.get('store').query('student', {filter: {number: studentID}}).then(
       (result) => {
         if(result.get('length') > 0){
           var index = this.get('studentsModel').indexOf(result.objectAt(0));
           this.set('INDEX', index);

           this.set('notDONE', false);
           Ember.$('.ui.modal').modal('hide');
           Ember.$('.ui.modal').remove();
         } else {
           alert("Invalid student number!");
         }

       }
     ).catch(()=>{
      alert("Error!");
      this.set('notDONE', false);
      Ember.$('.ui.modal').modal('hide');
      Ember.$('.ui.modal').remove();
     });
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

