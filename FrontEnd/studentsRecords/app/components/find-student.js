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

    //alert("id " + studentID); //<- it is getting the right id
     this.get('store').queryRecord('student', {filter: {number: studentID}}).then(
       (result) => {
         var index = this.get('studentsModel').indexOf(result);
         this.set('INDEX', index);
         this.set('notDONE', false); //notDone 
       }
     );

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

