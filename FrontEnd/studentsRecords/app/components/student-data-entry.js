import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  showAllStudents: false,
  residencyModel: null,
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
  showHelp: false,
  showFindStudent: false,
  undoStack: [],

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
  },

  didRender() {
    Ember.$('.menu .item').tab();
  },


  actions: {
    saveStudent () {

      var updatedStudent = this.get('currentStudent');
      var res = this.get('store').peekRecord('residency', this.get('selectedResidency'));
      updatedStudent.set('gender', this.get('selectedGender'));
      updatedStudent.set('DOB', new Date(this.get('selectedDate')));
      updatedStudent.set('resInfo', res);

      //Deal with clearing and adding this saved student to the stack
      this.send('clearStack');
      this.send('addRecordToStack', updatedStudent);

      updatedStudent.save().then(() => {
        //     this.set('isStudentFormEditing', false);
      });
    },

    clearStack(){
      //Clear the stack
      var stackToSave = this.get('undoStack');
      while(stackToSave.length > 0){
        stackToSave.popObject();
      }
    },

    addRecordToStack(student){
      //Create a copy of the student as a basic object
      var studentCopy = {
        id: student.get('id'),
        number: student.get('number'),
        firstName: student.get('firstName'),
        lastName: student.get('lastName'),
        gender: student.get('gender'),
        DOB: student.get('DOB'),
        photo: student.get('photo'),
        registrationComments: student.get('registrationComments'),
        basisOfAdmission: student.get('basisOfAdmission'),
        admissionAverage: student.get('admissionAverage'),
        admissionComments: student.get('admissionComments'),
        awards: student.get('awards'),
        advancedStandings: student.get('advancedStandings'),
        resInfo: student.get('resInfo')
      };
      //Save to the stack
      this.get('undoStack').pushObject(studentCopy);
    },

    undoSave(){
      //Cycle through the undo stack
      var undoStack = this.get('undoStack');
      while(undoStack.length > 0) {
        //Get the student from the stack and reset the record in the database
        var studentToUndo = undoStack.popObject();
        var recordToChange = this.get('studentsRecords', studentToUndo.id);
        console.log(recordToChange.get('firstName'));
      }
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
    },

    selectResidency (residency){
      this.set('selectedResidency', residency);
    },

    assignDate (date){
      this.set('selectedDate', date);
    },

    findStudent() {
      this.set('showFindStudent', true);
      this.set('showAllStudents', false);
    },

    help(){
      this.set('showHelp', true);
    },
  }
});
