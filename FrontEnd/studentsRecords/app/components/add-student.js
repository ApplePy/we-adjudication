import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  residencyModel: null,
  genderModel: null,
  selectedResidency: null,
  selectedGender: null,
  selectedDate: null,
  studentPhoto: null,
  pageSize: null,
  numBox: null,
  fNameBox: null,
  lNameBox: null,
  isHelpShowing: false,

  init() {
    this._super(...arguments);
    // load Residency data model
    var self = this;
    this.get('store').findAll('residency').then((records) => {
      self.set('residencyModel', records);
    });
    this.get('store').findAll('gender').then(function (records) {
      self.set('genderModel', records);
    });
  },

  actions: {
    saveStudent () {
      var res = this.get('store').peekRecord('residency', this.get('selectedResidency'));
      var gen = this.get('store').peekRecord('gender', this.get('selectedGender'));
      var DOB = this.get('store').peekRecord('student', this.get('selectedDate'));
      var store = this.get('store');

      var newStudent = this.get('store').createRecord('student', {
        number: this.get('numBox'),
        firstName: this.get('fNameBox'),
        lastName: this.get('lNameBox'),
        gender: gen,
        photo: this.get('studentPhoto'),
        DOB: new Date(this.get('selectedDate')),
        resInfo: res
      });
      newStudent.save();
    },

    helpMe () {
      this.set('isHelpShowing', true);
    },

    addMalePhoto () {
      this.set('studentPhoto', "/assets/studentsPhotos/male.png");
    },

    addFemPhoto () {
      this.set('studentPhoto', "/assets/studentsPhotos/female.png");
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
  }
});
