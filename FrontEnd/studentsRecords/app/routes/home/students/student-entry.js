import Ember from 'ember';

export default Ember.Route.extend({
  store: Ember.inject.service(),

  model: function(params) {
    return this.get('store').findRecord('student', params.student_id);
  },

  afterModel: function() {
    // Load all the needed models in advance before loading the template
    return Ember.RSVP.hash({
      residency: this.get('store').findAll('residency'),
      gender: this.get('store').findAll('gender'),
      "program-status": this.get('store').findAll('program-status'),
      "plan-code": this.get('store').findAll('plan-code'),
      "course-load": this.get('store').findAll('course-load'),
      "term-code": this.get('store').findAll('term-code')
    });
  },

  // These actions just send them over to the students controller to handle
  actions: {
    findStudentInternal: function() {
      this.controllerFor("home.students").send("findStudent");
    },
    firstStudentInternal: function() {
      this.controllerFor("home.students").send("firstStudent");
    },
    lastStudentInternal: function() {
      this.controllerFor("home.students").send("lastStudent");
    },
    nextStudentInternal: function() {
      this.controllerFor("home.students").send("nextStudent");
    },
    previousStudentInternal: function() {
      this.controllerFor("home.students").send("previousStudent");
    },
    allStudentsInternal: function() {
      this.controllerFor("home.students").send("allStudents");
    },
    destroyedStudent: function() {
      // Record was destroyed, take advantage of the students redirect to handle edge cases (e.g. last student deleted)
      this.transitionTo("home.students");
    }
  }
});
