import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  showAllStudents: false,
  residencyModel: null,
  genderModel: null,
  statusModel: null,
  loadModel: null,
  planModel: null,
  termCodeModel: null,
  selectedResidency: null,
  selectedGender: null,
  selectedDate: null,
  studentsRecords: null,
  currentStudent: null,
  currentIndex: null,
  firstIndex: 0,
  lastIndex: 0,
  studentPhoto: null,
  limit: null,
  offset: null,
  old_offset: null,
  pageSize: null,
  movingBackword: false,
  isDeleting: false,
  showFindStudent: false,
  showNewCourse: false,
  showNewAward: false,
  awardNotes: [],
  advancedStandingArray: [],
  termModel: [],
  updateAdmission: false,
  codeModel: [],

  studentModel: Ember.observer('offset', function () {
    var self = this;
    this.get('store').query('student', {
      limit: self.get('limit'),
      offset: self.get('offset')
    }).then(function (records) {
      // Make sure records were returned before setting the new records
      if (records.get('length') > 0 || self.get('old_offset') === null) {
        self.set('old_offset', self.get('offset')); // Update last good offset property
        self.set('studentsRecords', records);
        self.set('firstIndex', records.indexOf(records.get("firstObject")));
        self.set('lastIndex', records.indexOf(records.get("lastObject")));
        if (self.get('movingBackword')) {
          self.set('currentIndex', records.indexOf(records.get("lastObject")));
        } else {
          self.set('currentIndex', records.indexOf(records.get("firstObject")));
        }
      } else {
        // Revert to last good offset property
        self.set('offset', self.get('old_offset'));
      }
    });
  }),

  fetchStudent: Ember.observer('currentIndex', function () {
    this.showStudentData(this.get('currentIndex'));
  }),

  init() {
    this._super(...arguments);
    // load Residency data model
    this.get('store').findAll('residency').then(function (records) {
      self.set('residencyModel', records);
    });

    this.get('store').findAll('gender').then(function (records) {
      self.set('genderModel', records);
    });

    this.get('store').findAll('program-status').then(function (records) {
      self.set('statusModel', records);
    });

    this.get('store').findAll('plan-code').then(function (records) {
      self.set('planModel', records);
    });

    this.get('store').findAll('course-load').then(function (records) {
      self.set('loadModel', records);
    });

    this.get('store').findAll('term-code').then(function(records){
      self.set('termCodeModel', records);
    });

    //load all of the grades into the store
    this.get('store').query('grade', {limit: 10}).then((records) => {
      if( typeof records.get('meta') === "object" &&
        typeof records.get('meta').total === "number" &&
        10 < records.get('meta').total)
      {
        this.get('store').query('grade', {limit: records.get('meta').total - 10, offset: 10});
      }
    });

this.set('codeModel', []);
    //load all the codes
     this.get('store').query('assessment-code', {limit: 10}).then((records) => {
    let totalRecords = records.get('meta').total;
    let offsetUsed = records.get('meta').offset;
    let limitUsed = records.get('meta').limit;
    this.get('store').query('assessment-code', {limit: totalRecords}).then((code) => {
    for (var i = 0; i < code.get('length'); i++) {
        this.get('codeModel').pushObject(code.objectAt(i));
      }
    });
  });

    //Load all of the program records into the store
    this.get('store').query('program-record', {limit: 10}).then((records) => {
      if( typeof records.get('meta') === "object" &&
        typeof records.get('meta').total === "number" &&
        10 < records.get('meta').total)
      {
        this.get('store').query('program-record', {limit: records.get('meta').total - 10, offset: 10});
      }
    });

    // load first page of the students records
    this.set('limit', 10);
    this.set('offset', 0);
    this.set('pageSize', 10);
    var self = this;
    this.get('store').query('student', {
      limit: self.get('limit'),
      offset: self.get('offset')
    }).then(function (records) {
      self.set('studentsRecords', records);
      self.set('firstIndex', records.indexOf(records.get("firstObject")));
      self.set('lastIndex', records.indexOf(records.get("lastObject")));

      // Show first student data
      self.set('currentIndex', self.get('firstIndex'));
    });

  },

  showStudentData: function (index) {
    this.set('currentStudent', this.get('studentsRecords').objectAt(index));
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

       for(var i = 0; i < terms.get('length'); i++) {
          var term = terms.objectAt(i);
          this.get('termModel').pushObject(term);

          this.get('store').query('course-code', {limit: baseLimit, filter: {termInfo: term.id}}).then((records) => {
            if( typeof records.get('meta') === "object" &&
                typeof records.get('meta').total === "number" &&
                baseLimit < records.get('meta').total)
            {
                this.get('store').query('course-code', {limit: records.get('meta').total - baseLimit, offset: baseLimit, filter: {termInfo: term.id}});
            }
          });
       }

       if( typeof terms.get('meta') === "object" &&
         typeof terms.get('meta').total === "number" &&
         baseLimit < terms.get('meta').total)
       {
         this.get('store').query('term', {
           limit: terms.get('meta').total - baseLimit,
           offset: baseLimit,
           filter: {student: this.get('currentStudent').id}
         }).then((moreTerms) => {
           for(var i = 0; i < moreTerms.get('length'); i++) {
             var term = moreTerms.objectAt(i);
             this.get('termModel').pushObject(term);

             this.get('store').query('course-code', {limit: baseLimit, filter: {termInfo: term.id}}).then((records) => {
               if( typeof records.get('meta') === "object" &&
                 typeof records.get('meta').total === "number" &&
                 baseLimit < records.get('meta').total)
               {
                 this.get('store').query('course-code', {limit: records.get('meta').total - baseLimit, offset: baseLimit, filter: {termInfo: term.id}});
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
    saveStudent () {
      console.log(this.get('currentStudent').get('genderInfo').get('id'));
      console.log(this.get('selectedGender'));
      var updatedStudent = this.get('currentStudent');
      updatedStudent.set('DOB', new Date(this.get('selectedDate')));
      updatedStudent.save().then(() => {

      });
      console.log(this.get('currentStudent').get('genderInfo').get('id'));
      console.log(this.get('selectedGender'));
    },

    undoSave(){
      this.get('currentStudent').rollbackAttributes();
      //Change the selected values so it doesn't mess with next student
      this.set('selectedResidency', this.get('currentStudent').get('resInfo').get('id'));
      this.set('selectedGender', this.get('currentStudent').get('genderInfo').get('id'));
      this.set('selectedDate', this.get('currentStudent').get('DOB').toISOString().substring(0, 10));
    },

    firstStudent() {
      this.set('currentIndex', this.get('firstIndex'));
    },

    nextStudent() {
      this.set('movingBackword' , false);
      if (this.get('currentIndex') < this.get('lastIndex')) {
        this.set('currentIndex', this.get('currentIndex') + 1);
        //     console.log(JSON.stringify(this.get('currentStudent')));
      }
      else {
        this.set('offset', this.get('offset') + this.get('pageSize'));
      }
    },

    previousStudent() {
      this.set('movingBackword' , true);
      if (this.get('currentIndex') > 0) {
        this.set('currentIndex', this.get('currentIndex') - 1);
      }
      else if (this.get('offset') > 0) {
        this.set('offset', this.get('offset') - this.get('pageSize'));
      }
    },

    lastStudent() {
      this.set('currentIndex', this.get('lastIndex'));
    },

    allStudents() {
      this.set('showAllStudents', true);
      this.set('showFindStudent', false);
    },

    selectGender (gender){
      this.set('selectedGender', gender);
      //Set the value of this student's gender to the gender selected
      var gen = this.get('store').peekRecord('gender', this.get('selectedGender'));
      this.get('currentStudent').set('genderInfo', gen);
    },

    selectResidency (residency){
      this.set('selectedResidency', residency);
      //Set the value of this student's residency to this one
      var res = this.get('store').peekRecord('residency', this.get('selectedResidency'));
      this.get('currentStudent').set('resInfo', res);
    },

    assignDate (date){
      this.set('selectedDate', date);
    },

    //Brings up the confirm-delete component.  Will ask if sure wants to delete
    deleteStudent(){
      this.set('isDeleting', true);
    },

    //Called from confirmation on modal
    confirmedDelete(){

      //Delete the student from the database.  **Also need to delete advanced standing and scholarships and awards**
      this.get('store').findRecord('student', this.get('currentStudent').id, { backgroundReload: false }).then(function(student) {
        student.deleteRecord();
        student.save(); // => DELETE to /student/:_id
      });

      //If this is the last student on the page, load previous.  If not, load next
      if(this.get('currentIndex') === this.get('lastIndex')){
        this.send('previousStudent');
      } else {
        this.send('nextStudent');
      }

      //Subtract 1 from the last index of this page of students to account for the missing record
      this.set('lastIndex', this.get('lastIndex') - 1);
    },

    findStudent() {
      this.set('showFindStudent', true);
      this.set('showAllStudents', false);
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
