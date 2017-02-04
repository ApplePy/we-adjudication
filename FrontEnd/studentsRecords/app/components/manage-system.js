import Ember from 'ember';

export default Ember.Component.extend({

  genders: null,
  residencies: null,
  modifyResidencyClicked: false,
  newGender: null,
  newResidency: null,
  genderNames: [],
  residencyNames: [],

  init() {

    genders = this.get('store').findAll('gender');
    residencies = this.get('store').findAll('residency');

    for each gender in genders {
      genderNames.push(gender.name);
    }

    for each residency in residencies {
      genderNames.push(gender.name);
    }

    a.forEach(function(element) {
      console.log(element);
    });

  },

  actions: {
    addGender () {
      var gender = this.get('store').createRecord('gender', {
        gender: newGender
      });

      gender.save().then(function(value) {
        console.log(value);
      }, function(reason) {
        console.log(reason);
      }); // => POST to '/genders'
    },

    modifyGender (genderId, newGenderName){
      this.get('store').findRecord('gender', genderId).then(function(gender) {
        gender.set('name', this.get(newGenderName));
        gender.save().then(function(value) {
          console.log(value);
        }, function() {
          console.log("Could not modify gender.");
        }); // => PATCH to '/genders/1'
      });
    },

    deleteGender (genderId){
      this.get('store').findRecord('gender', genderId, { backgroundReload: false }).then(function(gender) {
        gender.destroyRecord(); // => DELETE to /genders/:genderId
      });
    },

    addResidency () {
      var gender = this.get('store').createRecord('residency', {
        residency: newResidency
      });

      gender.save().then(function(value) {
        console.log(value);
      }, function(reason) {
        console.log(reason);
      }); // => POST to '/genders'
    },

    modifyResidency (residencyId, newResidencyName){
      this.get('store').findRecord('residency', residencyId).then(function(residency) {
        residency.set('name', this.get(newResidencyName));
        residency.save().then(function(value) {
          console.log(value);
        }, function(reason) {
          console.log(reason);
        }); // => PATCH to '/genders/1'
      });
    },

    deleteResidency (residencyId){
      this.get('store').findRecord('gender', residencyId, { backgroundReload: false }).then(function(residency) {
        residency.destroyRecord(); // => DELETE to /genders/:genderId
      });
    }
  }

});
