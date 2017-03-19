import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  studentsModel: null,
  INDEX: null,
  studentID: null,
  fName: "",
  lName: "",
  notDONE: null,
  student: null,
  showFoundStudent: false,
  studentArray: [],

  actions: {
    find: function () {
      var studentID = this.get('studentID');
      var firstName = this.get('fName');
      var lastName = this.get('lName');
      //the result array where matching students will be stored
      var resultArray = [];

      this.get('store').query('student', {
         filter: {
           snum: studentID,
           //firstN: firstName,
           //lastN: lastName
         }
       }).then((codes) => {
        for(var i = 0; i < codes.get('length'); i++) {
          this.get('studentArray').pushObject(codes.objectAt(i));
        }
       });

      var filterObject = {};
      if (studentID != "") {
        filterObject["number"] = studentID;
      }
      if (firstName != "") {
        filterObject["firstName"] = firstName;
      }
      if (lastName != "") {
        filterObject["lastName"] = lastName;
      }

      this.get('store').query('student', {limit: 10}).then(
       (result) => {
         let totalRecords = result.get('meta').total;
         this.get('store').query('student', {limit: totalRecords, filter: filterObject}).then((result) =>{
           result.forEach(element => this.get('studentArray').pushObject(element));
        
            if (result.get('length') === 1)
            {
             var index = this.get('studentsModel').indexOf(result.get("firstObject"));
            }
            
            if(result.get('length') > 1) 
            {
              this.set('showFoundStudent', true);
              console.log(this.get('studentArray'));
           }

           if(result.get('length') === 0)
            {
              alert("No student found!");
            }
          
            this.set('INDEX', index);
            this.set('notDONE', false);

            Ember.$('.ui.modal').modal('hide');
            Ember.$('.ui.modal').remove();
        }
      ).catch((err) => {
        console.log(err);
        alert("Invalid search!");
        console.log(this.get('studentArray'));
         });
      });
    },

    close: function () {
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

