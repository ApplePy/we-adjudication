import Ember from 'ember';
import pagedArray from 'ember-cli-pagination/computed/paged-array';


export default Ember.Component.extend({
  store: Ember.inject.service(),

  // Variables injected in
  closeModal: null,

  // Variables bound to template inputs
  studentID: null,
  fName: "",
  lName: "",

  // Modal-bound variables
  showFoundStudent: false,
  studentArray: [],
  studentPaged: pagedArray('studentArray', {
    perPage: 10
  }),

  studentsModel: null,
  INDEX: null,
  notDONE: null,
  student: null,

  actions: {
    find: function () {
      let studentID = this.get('studentID');
      let firstName = this.get('fName');
      let lastName = this.get('lName');

      // Set up filter object
      let filterObject = {};
      if (studentID !== "") {
        filterObject.number = {$regex: studentID + ".*"};
      }
      if (firstName !== "") {
        filterObject.firstName = {$regex: firstName + ".*"};
      }
      if (lastName !== "") {
        filterObject.lastName = {$regex: lastName + ".*"};
      }

      //Get all matching students
      return this.get('store').query('student', { filter: filterObject })
        .then(result => {

          // Get all students, not just the meta
          let totalRecords = result.get('meta').total;
          return this.get('store').query('student', { limit: totalRecords, filter: filterObject });
        })
        .then(result => {

          // If only one result, go straight to it
          if (result.get('length') === 1) {
            // Remove this modal without triggering closeModal callback
            Ember.$('.ui.modal').modal('hide');
            Ember.$('.ui.modal').remove();

            this.get('closeModal')(result.get('firstObject'));
          }

          // If multiple results, display the list
          else if (result.get('length') > 1) {
            // DO NOT REMOVE MODAL. Leave it to studentsList to clean up modals kicking around. Otherwise the race condition causes students-list to not show.
            // Ember.$('.ui.modal').modal('hide');
            // Ember.$('.ui.modal').remove();

            console.log('multiple');

            this.set('studentArray', result);
            this.set('showFoundStudent', true);
          }

          // No records were found
          else {
            alert("No student found!");
            console.error("No student matching " + filterObject + " was found.");
            this.send('close');
          }
        })
        .catch((err) => {
          console.error(err);
          alert("Invalid search!");
          console.log(this.get('studentArray'));
          this.send("close");
        });
    },

    close: function () {
      Ember.$('.ui.modal').modal('hide');
      Ember.$('.ui.modal').remove();

      // Close this modal completely
      this.get('closeModal')();
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

