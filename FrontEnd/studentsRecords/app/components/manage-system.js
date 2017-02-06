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

    //this.get('genders') = this.get('store').findAll('gender');
    //this.get('residencies') = this.get('store').findAll('residency');

    /*this.get('genders').forEach(function(gender) {
      this.get('genderNames').push(gender.name);
    });

    this.get('residencies').forEach(function(residency) {
      this.get('residencyNames').push(residency.name);
    });*/

    this.get('store').findAll('residency').then(function (records) {
      self.set('residencies', records);
    });

    this.get('store').findAll('gender').then(function (records) {
      self.set('genders', records);
    });

  },

  actions: {

    update() {

      this.get('store').findAll('residency').then(function (records) {
        self.set('residencies', records);
      });

      this.get('store').findAll('gender').then(function (records) {
        self.set('genders', records);
      });

    },

    addGender () {
      var gender = this.get('store').createRecord('gender', {
        gender: this.get('newGender')
      });

      console.log(this.get('newGender'));

      gender.save().then(function() {
        this.send('update');
        console.log("Added Gender");
      }, function() {
        console.log("Could not add gender");
      }); // => POST to '/genders'
    },

    modifyGender (genderId, index){

      var newGenderName = Ember.$("#" + index + " .genderInput").val();
      console.log("here1");
      console.log(newGenderName);
      console.log("here2");

      this.get('store').findRecord('gender', genderId).then(function(gender) {
        gender.set('name', newGenderName);
        gender.save().then(function() {
          this.send('update');
          console.log("Modified Gender");
        }, function() {
          console.log("Could not modify gender");
        }); // => PATCH to '/genders/1'
      });
    },

    deleteGender (genderId){
      this.get('store').findRecord('gender', genderId, { backgroundReload: false }).then(function(gender) {
        gender.destroyRecord().then(function() {
          this.send('update');
          console.log("Deleted gender");
        }); // => DELETE to /genders/:genderId
      });
    },

    addResidency () {
      var gender = this.get('store').createRecord('residency', {
        residency: this.get('newResidency')
      });

      gender.save().then(function() {
        this.send('update');
        console.log("Added Residency");
      }, function() {
        console.log("Could not add residency");
      }); // => POST to '/genders'
    },

    modifyResidency (residencyId, newResidencyName){
      this.get('store').findRecord('residency', residencyId).then(function(residency) {
        residency.set('name', this.get(newResidencyName));
        residency.save().then(function() {
          this.send('update');
          console.log("Modified Residency");
        }, function() {
          console.log("Could not modify residency");
        }); // => PATCH to '/genders/1'
      });
    },

    deleteResidency (residencyId){
      this.get('store').findRecord('gender', residencyId, { backgroundReload: false }).then(function(residency) {
        residency.destroyRecord().then(function() {
          this.send('update');
          console.log("Deleted residency");
        }); // => DELETE to /genders/:genderId
      });
    }
  }

});
