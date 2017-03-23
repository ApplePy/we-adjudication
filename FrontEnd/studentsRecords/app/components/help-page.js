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
    },
    {
      title: "Adjudication Rules",
      description: "When using the \"Manage Adjudication Rules\" page:",
      list: [
        {
          button: "Parameter",
          hint: "The object you wish to compare.  Example: Program"
        },
        {
          button: "Operator",
          hint: "The comparison you wish to make.  Example: Equals"
        },
        {
          button: "Value",
          hint: "The value to which you wish to compare the parameter.  Example: Software Engineering"
        },
        {
          button: "Add",
          hint: "Add the expression to the rule"
        },
        {
          button: "Link dropdown",
          hint: "Connect two expressions with a logical link.  Choosing 'done building' will complete the entire expression and " +
                "you will be prompted to save, return to that last rule, or cancel.  Choosing anything other than done will allow " +
                "you to select another expression."
        },
        {
          button: "Rule Example",
          hint: "If a student is graduating from Software Engineering, they must have received an average of 50 in " +
                "SE 3350.  The expression to represent this would be Program equals Software Engineering and Course " +
                " Letter equals SE and Course Number equals 3350 and Grade greater than or equal to 50"
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
