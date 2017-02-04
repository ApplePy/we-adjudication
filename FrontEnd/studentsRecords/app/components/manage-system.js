import Ember from 'ember';

export default Ember.Component.extend({

  modifyResidencyClicked: false,

  actions: {
    addGender (newGender) {
      var gender = this.get('store').createRecord('gender', {
        gender: newGender
      });

      gender.save().then(function(value) {
        console.log('saved');
      }, function(reason) {
        console.log('failed');
      }); // => POST to '/genders'
    },

    modifyGender (newGenderName, genderId){
      this.get('store').findRecord('gender', genderId).then(function(gender) {
        gender.set('name', newGenderName);
        gender.save().then(function(value) {
          console.log('saved');
        }, function(reason) {
          console.log('failed');
        }); // => PATCH to '/genders/1'
      });
    },

    deleteGender (genderId){
      this.get('store').findRecord('gender', genderId, { backgroundReload: false }).then(function(gender) {
        gender.destroyRecord(); // => DELETE to /genders/:genderId
      });
    },

    addResidency (newResidency) {
      var gender = this.get('store').createRecord('residency', {
        residency: newResidency
      });

      gender.save().then(function(value) {
        console.log('saved');
      }, function(reason) {
        console.log('failed');
      }); // => POST to '/genders'
    },

    modifyResidency (newResidencyName, residencyId){
      this.get('store').findRecord('residency', residencyId).then(function(residency) {
        residency.set('name', newResidencyName);
        residency.save().then(function(value) {
          console.log('saved');
        }, function(reason) {
          console.log('failed');
        });; // => PATCH to '/genders/1'
      });
    },

    deleteResidency (residencyId){
      this.get('store').findRecord('gender', residencyId, { backgroundReload: false }).then(function(residency) {
        residency.destroyRecord(); // => DELETE to /genders/:genderId
      });
    }
  }

});
