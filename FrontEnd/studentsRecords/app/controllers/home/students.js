import Ember from 'ember';

export default Ember.Controller.extend({
  // Injected variables
  model: [],

  store: Ember.inject.service(),

  // variables to support the actions
  students: Ember.computed(function () {
    return this.get('store').peekAll('student');
  }),
  currentStudentIndex: 0,

  // Can't get away from this modal design in v2...
  showAllStudents: false,
  showFindStudent: false,

  actions: {
    firstStudent() {
      // Transition to first student
      this.set('currentStudentIndex', 0);
      this.transitionToRoute('home.students.student-entry', this.get('students').get('firstObject'));
    },

    lastStudent() {
      // Transition to last student
      this.set('currentStudentIndex', this.get('students').get('length') - 1);
      this.transitionToRoute('home.students.student-entry', this.get('students').get('lastObject'));
    },

    nextStudent() {
      // Function to transition to next student
      let transition = () => {
        this.set('currentStudentIndex', this.get('currentStudentIndex') + 1);
        this.transitionToRoute('home.students.student-entry', this.get('students').objectAt(this.get('currentStudentIndex')));
      };

      // if we've reached the end, load the next 10 and transition
      if (this.get('students').get('length') - 1 === this.get('currentStudentIndex')) {
        console.log('Loading more students...');

        this.get('store').query('student', { offset: this.get('currentStudentIndex') + 1, limit: 10 })
          .then(() => {

            // Double-check that more records were found before transitioning
            if (this.get('students').get('length') - 1 === this.get('currentStudentIndex')) {
              // No more records
              throw Error("No more records!");
            }

          })
          .then(transition) // Only fires if the previous then didn't throw
          .catch(err => console.warn(err.message));
      }
      // Still have more models, just transition
      else {
        transition();
      }
    },

    previousStudent() {
      // if we've reached the end, do nothing
      if (this.get('currentStudentIndex') > 0) {
        this.set('currentStudentIndex', this.get('currentStudentIndex') - 1);
        this.transitionToRoute('home.students.student-entry', this.get('students').objectAt(this.get('currentStudentIndex')));
      } else {
        console.warn("Can't navigate before the first student.");
      }
    },

    allStudents() {
      this.set("showAllStudents", true);
    },
    
    findStudent() {
      this.set("showFindStudent", true);
    },

    reload() {
      // Handle deleting the last object in the array
      if (this.get('students').get('length') <= 0) {
        this.transitionToRoute("home");
      }

      // Handle deleting the last-positioned object in the array
      while (this.get('currentStudentIndex') >= this.get('students').get('length')) {
        this.set('currentStudentIndex', this.get('currentStudentIndex') - 1);
      }

      // Transition to next student
      this.transitionToRoute('home.students.student-entry', this.get('students').objectAt(this.get('currentStudentIndex')));
    },

    closeModal(modalVariable, newStudent) {
      // Close modal
      this.set(modalVariable, false);

      // Student viewed may not want to change
      if(typeof newStudent !== "undefined" && newStudent !== null) {
        let index = this.get('students').indexOf(el => el.get('id') === newStudent.get('id'));
        this.set('currentStudentIndex', index);
        this.transitionToRoute('home.students.student-entry', newStudent);
      }
    }
  },
});
