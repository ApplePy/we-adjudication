import Ember from 'ember';

export default Ember.Component.extend({

  store: Ember.inject.service(),
  genders: null,
  residencies: null,
  newGender: null,
  newResidency: null,
  //genderNames: [],
  //residencyNames: [],

  init() {

    this._super(...arguments);

    var self = this;

    this.get('store').findAll('residency').then(function (records) {
      self.set('residencies', records);
    });

    this.get('store').findAll('gender').then(function (records) {
      self.set('genders', records);
    });

  },

  actions: {

    addGender () {
      var gender = this.get('store').createRecord('gender', {
        name: this.get('newGender')
      });

      gender.save().then(function() {
        console.log("Added Gender");
        this.set('newGender', "");
      }.bind(this), function() {
        console.log("Could not add gender");
      });
    },

    modifyGender (genderId, index){

      //var newGenderName = Ember.$("#" + index + ", .genderInput").val();
      var newGenderName = Ember.$("#" + index).val();

      this.get('store').findRecord('gender', genderId).then(function(gender) {
        gender.set('name', newGenderName);
        gender.save().then(function() {
          console.log("Modified Gender");
        }, function() {
          console.log("Could not modify gender");
        });
      });
    },

    deleteGender (genderId){
      this.get('store').findRecord('gender', genderId, { backgroundReload: false }).then(function(gender) {
        gender.destroyRecord().then(function() {
          console.log("Deleted gender");
        });
      });
    },

    addResidency () {
      var residency = this.get('store').createRecord('residency', {
        name: this.get('newResidency')
      });

      residency.save().then(function() {
        console.log("Added Residency");
        this.set('newResidency', "");
      }.bind(this), function() {
        console.log("Could not add residency");
      });
    },

    modifyResidency (residencyId, index){

      //var newResidencyName = Ember.$("#" + index + ", .residencyInput").val();
      var newResidencyName = Ember.$("#" + index).val();
      console.log(residencyId);
      console.log(index);
      console.log(newResidencyName);

      this.get('store').findRecord('residency', residencyId).then(function(residency) {
        residency.set('name', newResidencyName);
        residency.save().then(function() {
          console.log("Modified Residency");
        }, function() {
          console.log("Could not modify residency");
        });
      });
    },

    deleteResidency (residencyId){
      this.get('store').findRecord('residency', residencyId, { backgroundReload: false }).then(function(residency) {
        residency.destroyRecord().then(function() {
          console.log("Deleted residency");
        });
      });
    }
  }
});
