import Ember from 'ember';

export default Ember.Route.extend({
  store: Ember.inject.service(),

  model: function(params) {
    return this.get('store').findRecord('student', params.student_id);
  },

  afterModel: function() {
    // Load all the needed models in advance before loading the template
    // WARNING: relationship data is lost!
    return Ember.RSVP.hash({
      residency: this.get('store').findAll('residency'),
      gender: this.get('store').findAll('gender'),
      "program-status": this.get('store').findAll('program-status'),
      "plan-code": this.get('store').findAll('plan-code'),
      "course-load": this.get('store').findAll('course-load'),
      "term-code": this.get('store').findAll('term-code'),
      "assessment-code": this.get('store').findAll('assessment-code'),
      "grade": this.get('getAllModels').call(this, "grade"),
      "program-record": this.get('getAllModels').call(this, "program-record")
    });
  },

  /**
   * This function gets all models from a paginated route.
   */
  getAllModels: function (emberName) {
    return this.get('store').query(emberName, { limit: 10 })
      .then(records => {
        // Make sure to get all models
        if (typeof records.get('meta') === "object" && typeof records.get('meta').total === "number" && records.get('meta').limit < records.get('meta').total) {
          return this.get('store').query(emberName, { limit: records.get('meta').total - records.get('meta').limit, offset: records.get('meta').limit });
        } else {
          return records;
        }
      });
  },

  // These actions just send them over to the students controller to handle
  actions: {
    findStudentInternal: function() { this.controllerFor("home.students").send("findStudent"); },
    firstStudentInternal: function() { this.controllerFor("home.students").send("firstStudent"); },
    lastStudentInternal: function() { this.controllerFor("home.students").send("lastStudent"); },
    nextStudentInternal: function() { this.controllerFor("home.students").send("nextStudent"); },
    previousStudentInternal: function() { this.controllerFor("home.students").send("previousStudent"); },
    allStudentsInternal: function() { this.controllerFor("home.students").send("allStudents"); },
    // Record was destroyed, take advantage of the students redirect to handle edge cases (e.g. last student deleted)
    destroyedStudent: function() { this.controllerFor("home.students").send("reload"); }
  }
});
