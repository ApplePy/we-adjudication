import Ember from 'ember';

export default Ember.Component.extend({

  store: Ember.inject.service(),
  genders: null,
  residencies: null,
  newGender: null,
  newResidency: null,
  codes: [
    {
      name: "Genders",
      list: null,
      placeholder: "Add gender...",
      inputID: 'newGender',
      emberName: 'gender',
      inputModelProp: 'name'  // Have to do it this way since Ember.keys() fails to enumerate properties set to null
    },
    {
      name: "Residencies",
      list: null,
      placeholder: "Add residency...",
      inputID: 'newResidency',
      emberName: 'residency',
      inputModelProp: 'name'  // Have to do it this way since Ember.keys() fails to enumerate properties set to null
    },
    {
      name: "High School Course Sources",
      list: null,
      placeholder: "Add high school course source...",
      inputID: 'newCourseSource',
      emberName: 'hs-course-source',
      inputModelProp: 'code'  // Have to do it this way since Ember.keys() fails to enumerate properties set to null
    },
    {
      name: "UWO Course Loads",
      list: null,
      placeholder: "Add course load...",
      inputID: 'newCourseLoad',
      emberName: 'course-load',
      inputModelProp: 'load'  // Have to do it this way since Ember.keys() fails to enumerate properties set to null
    },
    {
      name: "UWO Program Statuses",
      list: null,
      placeholder: "Add program status...",
      inputID: 'newProgramStatus',
      emberName: 'program-status',
      inputModelProp: 'status'  // Have to do it this way since Ember.keys() fails to enumerate properties set to null
    },
    {
      name: "UWO Plan Codes",
      list: null,
      placeholder: "Add plan code...",
      inputID: 'newPlanCode',
      emberName: 'plan-code',
      inputModelProp: 'name'  // Have to do it this way since Ember.keys() fails to enumerate properties set to null
    }
  ],

  init() {

    this._super(...arguments);
    
    // Populate each type of system code with it's list
    for (let entry of this.codes) {
      /*jshint loopfunc: true */  // Shuts up jshint, since this dynamic function generation in a loop is needed
      this.get('store').findAll(entry.emberName).then(function(records) {
        Ember.set(entry, 'list', records);
      });
    }
  },

  actions: {
    addCode(emberName, DOMID, propName) {
      // Get the value of the text box
      var domval = this.$("#" + DOMID).val();

      // If the text box isn't empty...
      if (domval !== "") {

        // Create new record, and then save
        var newObj = this.get('store').createRecord(emberName, {
          [propName]: domval
        });

        newObj.save().then(function() {
          console.log("Added " + emberName);
        }, function() {
          console.log("Could not add " + emberName);
        });
      }
    },

    modifyCode (emberName, obj){

      // If the object exists, save the new update to DB
      if (obj.get('id') !== "") {
        obj.save();
      }
    },

    deleteCode (emberName, genderId){
      // Find the given record, then destroy it
      this.get('store').findRecord(emberName, genderId, { backgroundReload: false }).then(function(obj) {
        obj.destroyRecord().then(function() {
          console.log("Deleted " + emberName);
        });
      });
    }
  }
});
