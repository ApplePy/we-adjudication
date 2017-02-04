import Ember from 'ember';

export default Ember.Component.extend({

  notDONE: null,
  hints: [
    {
      title: "Student Records",
      description: "When using student records page:",
      list: [
        {
          button: "Save",
          hint: "Save any changes made to the student record directly to the database"
        },
        {
          button: "Undo",
          hint: "Undo the last change made to the record"
        },
        {
          button: "First",
          hint: "Display the first record currently loaded from the database"
        },
        {
          button: "Previous",
          hint: "Display the previous student by order of student number"
        },
        {
          button: "Next",
          hint: "Display the next student by order of student number"
        },
        {
          button: "Last",
          hint: "Display the last record currently loaded from the database"
        },
        {
          button: "All Records",
          hint: "Display a list of all students currently in the database and return to the data entry form for that student"
        },
        {
          button: "Find Record",
          hint: "Find a record in the database based on a student number"
        }
      ]
    },
    {
      title: "Adding Students",
      description: "When using the \"Add Student\" page:",
      list: [
        {
          button: "Save",
          hint: "Save any changes made to the student record directly to the database"
        },
        {
          button: "Add Male Photo",
          hint: "Testing placeholder - adds a male student image to the record."
        },
        {
          button: "Add Female Photo",
          hint: "Testing placeholder - adds a female student image to the record."
        }
      ]
    }
  ],

  actions: {

    exit: function () {
      this.set('notDONE', false);
      Ember.$('.ui.modal').modal('toggle');
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
