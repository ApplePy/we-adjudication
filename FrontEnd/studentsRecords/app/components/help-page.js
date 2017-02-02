import Ember from 'ember';

export default Ember.Component.extend({

  notDONE: null,
  hints: [{ button: "Save",
            hint: "Save any changes made to the student record directly to the database"
          },
          {
            button: "Undo",
            hint:"Undo the last change made to the record"
          },
          {
            button: "First",
            hint:"Display the first record currently loaded from the database"
          },
          {
            button: "Previous",
            hint:"Display the previous student by order of student number"
          },
          {
            button: "Next",
            hint:"Display the next student by order of student number"
          },
          {
            button: "Last",
            hint:"Display the last record currently loaded from the database"
          },
          {
            button: "All Records",
            hint:"Display a list of all students currently in the database and return to the data entry form for that student"
          },
          {
            button: "Find Record",
            hint:"Find a record in the database based on a student number"
          }],

  actions: {

    exit: function () {
      this.set('notDONE', false);
      Ember.$('.ui.modal').modal('toggle');

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
