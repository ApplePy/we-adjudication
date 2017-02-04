import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  residencyModel: null,
  selectedResidency: null,
  selectedGender: null,
  selectedDate: null,
  studentPhoto: null,
  pageSize: null,
  numBox: null,
  fNameBox: null,
  lNameBox: null,

  init() {
    this._super(...arguments);
    // load Residency data model
    this.get('store').findAll('residency').then((records) => {
      this.set('residencyModel', records);
    });
  },

  actions: {
    saveStudent () {
      var res = this.get('store').peekRecord('residency', this.get('selectedResidency'));
      //var gen = this.get('store').peekRecord('gender', this.get('selectedGender'));
      var DOB = this.get('store').peekRecord('student', this.get('selectedDate'));
      var store = this.get('store');

      var newStudent = this.get('store').createRecord('student', {
        number: this.get('numBox'),
        firstName: this.get('fNameBox'),
        lastName: this.get('lNameBox'),
        gender: null,
        photo: this.get('studentPhoto'),
        DOB: new Date(this.get('selectedDate')),
        resInfo: res
      });
      newStudent.save();
    },

    addMalePhoto () {
      this.set('studentPhoto', "/assets/studentsPhotos/male.png");
    },

    addFemPhoto () {
      this.set('studentPhoto', "/assets/studentsPhotos/female.png");
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
  }
});
