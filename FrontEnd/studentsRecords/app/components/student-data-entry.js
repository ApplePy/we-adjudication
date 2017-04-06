import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),

  // Passed actions
  firstStudent: null,
  lastStudent: null,
  nextStudent: null,
  previousStudent: null,
  allStudents: null,
  findStudent: null,
  destroyedStudent: null,

  // Modal toggling variables
  showAllStudents: false, // Looks like can be nuked
  isDeleting: false,
  showFindStudent: false, // Looks like can be nuked
  showNewCourse: false,
  showNewAward: false,
  updateAdmission: false,
  currentStudentRoute: null,
  
  currentStudent: null,
  residencyModel: null,
  genderModel: null,
  statusModel: null,
  loadModel: null,
  planModel: null,
  termCodeModel: null,
  selectedResidency: Ember.computed.oneWay('currentStudent.resInfo.id'),  // USED
  selectedGender: Ember.computed.oneWay('currentStudent.genderInfo.id'),  // USED
  selectedDate: null,       // USED
  studentPhoto: null,       // USED
  
  awardNotes: [],
  advancedStandingArray: [],
  termModel: [],
  
  codeModel: [],

  init() {
    this._super(...arguments);
    this.set('currentStudent', this.get('currentStudentRoute'));  // Kludge to handle the initial load, the observer will take care of the rest
    // load models for dropdowns (was already populated in the route)
    this.set('residencyModel', this.get('store').peekAll('residency'));
    this.set('genderModel', this.get('store').peekAll('gender'));
    this.set('statusModel', this.get('store').peekAll('program-status'));
    this.set('planModel', this.get('store').peekAll('plan-code'));
    this.set('loadModel', this.get('store').peekAll('course-load'));
    this.set('termCodeModel', this.get('store').peekAll('term-code'));
    this.set('codeModel', this.get('store').peekAll('assessment-code'));
    this.showStudentData();
  },
  
  // Reloads the modified student object from the database
  reloadStudent: function() {
    return this.get('store').findRecord("student", this.get('currentStudentRoute').get('id'), { reload: true })
      .then(student => {
        this.set('currentStudent', student);
        this.showStudentData();
        return student;
      });
  },

  currentStudentObserver: Ember.observer('currentStudentRoute', function () {
    // Replace the bum record with a good one
    this.reloadStudent();
  }),

  showStudentData: function () {
    // Set some basic data
    this.set('studentPhoto', this.get('currentStudent').get('photo'));
    var date = this.get('currentStudent').get('DOB');
    var datestring = date.toISOString().substring(0, 10);
    this.set('selectedDate', datestring);

    // Get awards for student
    this.set('awardNotes', []);
    this.get('store').query('award', { filter: { recipient: this.get('currentStudent').id } })
      .then((awards) => {
        for (var i = 0; i < awards.get('length'); i++) {
          this.get('awardNotes').pushObject(awards.objectAt(i));
        }
      });

    // Get advanced standings for student
    this.set('advancedStandingArray', []);
    this.get('store').query('advanced-standing', { filter: { recipient: this.get('currentStudent').id } })
      .then((standing) => {
        for (var i = 0; i < standing.get('length'); i++) {
          this.get('advancedStandingArray').pushObject(standing.objectAt(i));
        }
      });

    //Load all of the terms for this student
    var baseLimit = 10;
    this.set('termModel', []);
    this.get('store').query('term', {
      limit: baseLimit,
      filter: {
        student: this.get('currentStudent').id
      }
    }).then((terms) => {

      for (var i = 0; i < terms.get('length'); i++) {
        var term = terms.objectAt(i);
        this.get('termModel').pushObject(term);

        this.get('store').query('course-code', { limit: baseLimit, filter: { termInfo: term.id } }).then((records) => {
          if (typeof records.get('meta') === "object" &&
            typeof records.get('meta').total === "number" &&
            baseLimit < records.get('meta').total) {
            this.get('store').query('course-code', { limit: records.get('meta').total - baseLimit, offset: baseLimit, filter: { termInfo: term.id } });
          }
        });
      }

      if (typeof terms.get('meta') === "object" &&
        typeof terms.get('meta').total === "number" &&
        baseLimit < terms.get('meta').total) {
        this.get('store').query('term', {
          limit: terms.get('meta').total - baseLimit,
          offset: baseLimit,
          filter: { student: this.get('currentStudent').id }
        }).then((moreTerms) => {
          for (var i = 0; i < moreTerms.get('length'); i++) {
            var term = moreTerms.objectAt(i);
            this.get('termModel').pushObject(term);

            this.get('store').query('course-code', { limit: baseLimit, filter: { termInfo: term.id } }).then((records) => {
              if (typeof records.get('meta') === "object" &&
                typeof records.get('meta').total === "number" &&
                baseLimit < records.get('meta').total) {
                this.get('store').query('course-code', { limit: records.get('meta').total - baseLimit, offset: baseLimit, filter: { termInfo: term.id } });
              }
            });
          }
        });
      }
    });

  },

  didRender() {
    Ember.$('.menu .item').tab();
  },


  actions: {
    saveStudent() {
      console.log(this.get('currentStudent').get('genderInfo').get('id'));
      console.log(this.get('selectedGender'));
      var updatedStudent = this.get('currentStudent');
      updatedStudent.set('DOB', new Date(this.get('selectedDate')));
      updatedStudent.save().then(() => {

      });
      console.log(this.get('currentStudent').get('genderInfo').get('id'));
      console.log(this.get('selectedGender'));
    },

    undoSave() {
      this.reloadStudent();
    },

    firstStudent() { this.get('firstStudent')(); },

    nextStudent() { this.get('nextStudent')(); },

    previousStudent() { this.get('previousStudent')(); },

    lastStudent() { this.get('lastStudent')(); },

    allStudents() { this.get('allStudents')(); },

    findStudent() { this.get("findStudent")(); },

    selectGender(gender) {
      this.set('selectedGender', gender);
      //Set the value of this student's gender to the gender selected
      var gen = this.get('store').peekRecord('gender', this.get('selectedGender'));
      this.get('currentStudent').set('genderInfo', gen);
    },

    selectResidency(residency) {
      this.set('selectedResidency', residency);
      //Set the value of this student's residency to this one
      var res = this.get('store').peekRecord('residency', this.get('selectedResidency'));
      this.get('currentStudent').set('resInfo', res);
    },

    assignDate(date) { this.set('selectedDate', date); },

    //Brings up the confirm-delete component.  Will ask if sure wants to delete
    deleteStudent() { this.set('isDeleting', true); },

    //Called from confirmation on modal
    confirmedDelete() {

      //Delete the student from the database.  **Also need to delete advanced standing and scholarships and awards**
      this.get('currentStudent').destroyRecord()
        .then(() => this.get('destroyedStudent')());
    },

    addCourse() { this.set('showNewCourse', true); },

    addAward() { this.set('showNewAward', true); },

    updateAdmission() { this.set('updateAdmission', true); },
  }
});
