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
  studentArray: [],

  actions: {
    find: function () {
      var studentID = this.get('studentID');
      var firstName = this.get('fName');
      var lastName = this.get('lName');
      //the result array where matching students will be stored
      var resultArray = [];

      // Create filter object
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

      this.get('store').query('student', {filter: filterObject}).then(
       (result) => {
         result.forEach(element => this.get('studentArray').pushObject(element));

        
          //if the result array is bigger than one, show a list
          if(result.get('length') > 1) {
            // TODO
          }

          //if one, show the result
          if (result.get('length') === 1){
            var index = this.get('studentsModel').indexOf(result.get("firstObject"));
          }

          this.set('INDEX', index);
          this.set('notDONE', false);

          Ember.$('.ui.modal').modal('hide');
          Ember.$('.ui.modal').remove();
        }
      ).catch((err) => {
        console.log(err);
        alert("Invalid search!");
        //checks to see if any students are returned
     console.log(this.get('studentArray'));
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

