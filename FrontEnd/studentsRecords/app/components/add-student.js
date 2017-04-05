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
  studentAdded: false,
  studentFailAdded: false,

  init() {
    this._super(...arguments);
    // load Residency data model
    var self = this;
    this.get('store').findAll('residency').then((records) => {
      self.set('residencyModel', records);
    });
    // load Gender data model
    this.get('store').findAll('gender').then(function (records) {
      self.set('genderModel', records);
    });

   this.get('store').queryRecord('residency', {
         filter: {
           name: 'Canadian/Native'
         }
       }).then((res) => {
         self.set('selectedResidency', res.id); 
       }); 

       this.get('store').queryRecord('gender', {
         filter: {
           name: 'Male'
         }
       }).then((gen) => {
        self.set('selectedGender', gen.id);
       });
  },

  actions: {
    saveStudent () {
      var res = this.get('store').peekRecord('residency', this.get('selectedResidency'));
      var gen = this.get('store').peekRecord('gender', this.get('selectedGender'));

      var newStudent = this.get('store').createRecord('student', {
        number: this.get('numBox'),
        firstName: this.get('fNameBox'),
        lastName: this.get('lNameBox'),
        genderInfo: gen,
        photo: this.get('studentPhoto'),
        DOB: new Date(this.get('selectedDate')),
        resInfo: res
      });

      var self = this;

      newStudent.save().then(() => {
        self.set('studentAdded', true);
      }).catch((adapterError) => {
        self.set('studentFailAdded', true);
      });

      // TODO: Review later to see if necessary. Merging for now.

      this.set('numBox', null);
      this.set('fNameBox', null);
      this.set('lNameBox', null);
      this.set('residencyModel', null);
    //  this.set('selectedResidency', null);
     // this.set('selectedGender', null);
      this.set('selectedDate', null);
      this.set('studentPhoto', null);
      console.log(this.get('selectedGender'));

      this.get('store').findAll('residency').then((records) => {
        this.set('residencyModel', records);
      });
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
