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
      var store = this.get('store');

      alert(this.get('numBox'));

      var newStudent = this.get('store').createRecord('student', {
        number: this.get('numBox'),
        firstName: this.get('fNameBox'),
        lastName: this.get('lNameBox'),
        gender: this.get('selectGender'),
        DOB: this.get('assignDate'),
        resInfo: this.get('selectResidency'),
      });
      newStudent.save();
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
