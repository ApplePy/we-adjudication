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
  showHelp: false,
  showFindStudent: false, // Looks like can be nuked
  showNewCourse: false,
  showNewAward: false,
  updateAdmission: false,
  currentStudent: null,
  
  residencyModel: null,
  genderModel: null,
  statusModel: null,
  loadModel: null,
  planModel: null,
  termCodeModel: null,
  selectedResidency: null,  // USED
  selectedGender: null,     // USED
  selectedDate: null,       // USED
  // studentsRecords: null,    // Looks like can be nuked
  
  currentIndex: null,       // Currently required by delete to load a valid student after deletion
  // firstIndex: 0,            // Looks like it can be nuked
  lastIndex: 0,             // Currently required by delete to load a valid student after deletion
  studentPhoto: null,       // USED
  // limit: null,              // Looks like can be nuked
  // offset: null,             // Looks like can be nuked
  // old_offset: null,         // Looks like can be nuked
  // pageSize: null,           // Looks like can be nuked
  // movingBackword: false,    // Looks like can be nuked
  
  awardNotes: [],
  advancedStandingArray: [],
  termModel: [],
  
  codeModel: [],

  init() {
    this._super(...arguments);
    // load models for dropdowns
    
    this.set('residencyModel', this.get('store').peekAll('residency'));
    this.set('genderModel', this.get('store').peekAll('gender'));
    this.set('statusModel', this.get('store').peekAll('program-status'));
    this.set('planModel', this.get('store').peekAll('plan-code'));
    this.set('loadModel', this.get('store').peekAll('course-load'));
    this.set('termCodeModel', this.get('store').peekAll('term-code'));

    //load all of the grades into the store
    this.get('store').query('grade', { limit: 10 }).then((records) => {
      if (typeof records.get('meta') === "object" &&
        typeof records.get('meta').total === "number" &&
        10 < records.get('meta').total) {
        this.get('store').query('grade', { limit: records.get('meta').total - 10, offset: 10 });
      }
    });

    this.set('codeModel', []);
    //load all the codes
    this.get('store').query('assessment-code', { limit: 10 }).then((records) => {
      let totalRecords = records.get('meta').total;
      let offsetUsed = records.get('meta').offset;
      let limitUsed = records.get('meta').limit;
      this.get('store').query('assessment-code', { limit: totalRecords }).then((code) => {
        for (var i = 0; i < code.get('length'); i++) {
          this.get('codeModel').pushObject(code.objectAt(i));
        }
      });
    });

    //Load all of the program records into the store
    this.get('store').query('program-record', { limit: 10 }).then((records) => {
      if (typeof records.get('meta') === "object" &&
        typeof records.get('meta').total === "number" &&
        10 < records.get('meta').total) {
        this.get('store').query('program-record', { limit: records.get('meta').total - 10, offset: 10 });
      }
    });

    // Show first student data
      this.showStudentData();
  },

  showStudentData: function () {
    // Current student is set by route, can safely ignore
    //this.set('currentStudent', this.get('studentsRecords').objectAt(index));
    this.set('studentPhoto', this.get('currentStudent').get('photo'));
    var date = this.get('currentStudent').get('DOB');
    var datestring = date.toISOString().substring(0, 10);
    this.set('selectedDate', datestring);

    //Fixes gender/residency bug
    this.set('selectedResidency', this.get('currentStudent').get('resInfo').get('id'));
    this.set('awardNotes', []);
    this.set('advancedStandingArray', []);
    this.set('termModel', []);

    this.set('selectedGender', this.get('currentStudent').get('genderInfo').get('id'));

    this.get('store').query('award', {
      filter: {
        recipient: this.get('currentStudent').id
      }
    }).then((awards) => {
      for (var i = 0; i < awards.get('length'); i++) {
        this.get('awardNotes').pushObject(awards.objectAt(i));
      }
    });

    this.get('store').query('advanced-standing', {
      filter: {
        recipient: this.get('currentStudent').id
      }
    }).then((standing) => {
      for (var i = 0; i < standing.get('length'); i++) {
        this.get('advancedStandingArray').pushObject(standing.objectAt(i));
      }
    });

    //Load all of the terms for this student
    var baseLimit = 10;
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
      this.get('currentStudent').rollbackAttributes();
      //Change the selected values so it doesn't mess with next student
      this.set('selectedResidency', this.get('currentStudent').get('resInfo').get('id'));
      this.set('selectedGender', this.get('currentStudent').get('genderInfo').get('id'));
      this.set('selectedDate', this.get('currentStudent').get('DOB').toISOString().substring(0, 10));
    },

    firstStudent() {
      this.get('firstStudent')();
    },

    nextStudent() {
      this.get('nextStudent')();
    },

    previousStudent() {
      this.get('previousStudent')();
    },

    lastStudent() {
      this.get('lastStudent')();
    },

    allStudents() {
      this.get('allStudents')();
    },

    findStudent() {
      this.get("findStudent")();
    },

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

    assignDate(date) {
      this.set('selectedDate', date);
    },

    //Brings up the confirm-delete component.  Will ask if sure wants to delete
    deleteStudent() {
      this.set('isDeleting', true);
    },

    //Called from confirmation on modal
    confirmedDelete() {

      //Delete the student from the database.  **Also need to delete advanced standing and scholarships and awards**
      this.get('store').findRecord('student', this.get('currentStudent').id, { backgroundReload: false })
      .then(student => {
        student.destroyRecord()
        .then(() => this.get('destroyedStudent')());
      });
    },

    help() {
      this.set('showHelp', true);
    },

    addCourse() {
      this.set('showNewCourse', true);
      //this.set('showAddCourseButton', false);
    },

    addAward() {
      this.set('showNewAward', true);
    },

    updateAdmission() {
      this.set('updateAdmission', true);
    },
  }
});
