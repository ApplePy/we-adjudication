import Ember from 'ember';

export default Ember.Component.extend({
    newcourse: null,  
    newunit: null,
    newdescription: null,
    newgrade: null,
    newfrom: null,
    newrecipient: null,
    store: Ember.inject.service(),
  studentsModel: null,
  INDEX: null,
  //studentID: null,
  notDONE: null,
  //student: null,

 actions: {
  saveCourse() {
     var advancedStanding = this.get('store').createRecord('advanced-standing', {
      course: this.get('newcourse'),
      description: this.get('newdescription'),
      units: this.get('newunit'),
      grade: this.get('newgrade'),
      from: this.get('newfrom'),
      recipient: this.get('currentStudent')
      });
console.log("before");
      advancedStanding.save();/*.then(function(value) {
          
//what happens if save works
console.log("it worked");
      }, function(reason) {
//what happens if save doesnt work
console.log("didnt work");
      }); */
console.log("after");
    //this.set('notDONE', false);
     //Ember.$('.ui.modal').modal('hide');
     //Ember.$('.ui.modal').remove();
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
