import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  studentsModel: null,
  INDEX: null,
  studentID: null,
  firstName: null,
  lastName: null,
  notDONE: null,
  student: null,
  studentArray: [],

 actions: {
    find: function () {
      var studentID = this.get('studentID');
      var firstName = this.get('fName');
      var lastName = this.get('lName');
      var resultArray = [];

     this.get('store').query('student', {filter: {number: studentID, firstName: firstName, lastName: lastName}}).then(
       (result) => {
         for(var i = 0; i < result.get('length'); i++) {
           this.get('studentArray').pushObject(result.objectAt(i));
         }

         if(studentID.empty())
         {
           if ((this.indexOf(firstName) > -1) && ((this.indexOf(lastName) > -1)))
           {
             resultArray.push('student');
           }
         }
         else if(firstName.empty())
         {
           if ((this.indexOf(studentID) > -1) && ((this.indexOf(lastName) > -1)))
           {
             resultArray.push('student');
           }
         }
         else if(lastName.empty())
         {
           if ((this.indexOf(studentID) > -1) && ((this.indexOf(firstName) > -1)))
           {
             resultArray.push('student');
           }
         }
         else if(studentID.empty()&& firstName.empty())
         {
           if (this.indexOf(lastName) > -1) {resultArray.push(this);}
         }
         else if(studentID.empty()&& lastName.empty())
         {
           if (this.indexOf(firstName) > -1) {resultArray.push(this);}
         }
         else if(firstName.empty()&& lastName.empty())
         {
           if (this.indexOf(studentID) > -1) {resultArray.push(this);}
         }
         else
         {
           if ((this.indexOf(studentID) > -1) && (this.indexOf(firstName) > -1) && (this.indexOf(lastName) > -1))
           {
             resultArray.push('student');
           }
         }

         //if the result array is bigger than one, show a list
         //if one, show the result

         var index = this.get('studentsModel').indexOf(result);
         this.set('INDEX', index);
         this.set('notDONE', false);

         Ember.$('.ui.modal').modal('hide');
         Ember.$('.ui.modal').remove();
       }
     ).catch((err)=>{
       alert("Invalid search!");
     });
     //checks to see if any students are returned
     console.log(this.get('studentArray'));
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

