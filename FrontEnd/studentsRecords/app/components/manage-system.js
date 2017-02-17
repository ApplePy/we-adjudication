import Ember from 'ember';

export default Ember.Component.extend({

  store: Ember.inject.service(),
  genders: null,
  residencies: null,
  newGender: null,
  newResidency: null,

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
      if (this.get('newGender') !== "") {
        var gender = this.get('store').createRecord('gender', {
          name: this.get('newGender')
        });

        gender.save().then(function() {
          console.log("Added Gender");
        }, function() {
          console.log("Could not add gender");
        });
      }
    },

    modifyGender (gender){

      if (gender.get('id') !== "") {
        gender.save();
      }
    },

    deleteGender (genderId){
      this.get('store').findRecord('gender', genderId, { backgroundReload: false }).then(function(gender) {
        gender.destroyRecord().then(function() {
          console.log("Deleted gender");
        });
      });
    },

    addResidency () {
      if (this.get('newResidency') !== "") {
        var residency = this.get('store').createRecord('residency', {
          name: this.get('newResidency')
        });

        residency.save().then(function() {
          console.log("Added Residency");
        }, function() {
          console.log("Could not add residency");
        });
      }
    },

    modifyResidency (residency){

      if (residency.name !== "") {
        residency.save();
      }
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
