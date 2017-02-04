import Ember from 'ember';

export default Ember.Component.extend({
    newrecipient: null,
    store: Ember.inject.service(),
  studentsModel: null,
  INDEX: null,
  //studentID: null,
  notDONE: null,
  //student: null,

 actions: {
  saveAward() {
     var award = this.get('store').createRecord('award', {
      note: this.get('newnote'),
      recipient: this.get('currentStudent')
      });
console.log("before");
      award.save();/*.then(function(value) {
          
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
