import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  lists: { },                               // A dictionary that holds the lists of the ember models
  codes: [
    {
      name: "High Schools",                 // The name to display
      placeholder: ["Add high school..."],  // The placeholder to use if a property to be filled out is a textbox. NOTE: length must match inputModelProp length!
      emberName: 'secondary-school',        // The ember model name that's being represented
      inputModelProp: [                     // The model properties that need to be filled out, and their types (or their ember name if will be a dropdown)
        { name: 'name', type: "string" }
      ]
    },
    {
      name: "High School Subjects",
      placeholder: ["Add subject...", "Description"],
      emberName: 'hs-subject',
      inputModelProp: [
        { name: 'name', type: "string" },
        { name: 'description', type: "string" }
      ]
    },
    {
      name: "High School Course Sources",
      placeholder: ["Add high school course source..."],
      emberName: 'hs-course-source',
      inputModelProp: [
        { name: 'code', type: "string" }
      ]
    },
    {
      name: "High School Courses",
      placeholder: ["Add high school course...", "Unit", "Source", "Secondary School", "Subject"],
      emberName: 'hs-course',
      inputModelProp: [
        {
          name: 'level',      // Name of the property to be filled in
          type: "number"      // The type of the property (eg string, number, etc.), or "model" to specify an enum
        },
        { name: 'unit', type: "number" },
        {
          name: 'source', type: "model", modelName: "hs-course-source", modelLabel: "code"    // The property of the model to display as the dropdown text
        },
        { name: 'school', type: "model", modelName: "secondary-school", modelLabel: "name" },
        { name: 'subject', type: "model", modelName: "hs-subject", modelLabel: "name" },
      ]
    },
  ],

  init() {

    this._super(...arguments);
    
    // List population
    let GetAll = emberName => {
      // Make sure that the ember name hasn't already been populated
      if (typeof this.get('lists')[emberName] === "undefined") {
        // Set the value now, so that a duplicate isn't sent
        Ember.set(this.get('lists'), emberName, []);

        // Get the records
        this.get('store')
          .query(emberName, { limit: 10, offset: 0 })
          .then(records => {

            // If the result was paginated, get all results
            if (typeof records.get("meta").total !== "undefined" && records.get('meta').limit < records.get('meta').total) {
              this.get('store')
                .query(emberName, { limit: records.get("meta").total })
                .then(records => Ember.set(this.get('lists'), emberName, this.get('store').peekAll(emberName)));
            }
            else Ember.set(this.get('lists'), emberName, this.get('store').peekAll(emberName));
          });
      }
    }

    // Populate each type of system code with it's list
    for (let entry of this.codes) {
      /*jshint loopfunc: true */  // Shuts up jshint, since this dynamic function generation in a loop is needed
      GetAll(entry.emberName);

      // Make sure all models that depend on other models are loaded
      for (let prop of entry.inputModelProp) {
        if (prop.type === "model")
          GetAll(prop.modelName);
      }
    }
  },

  actions: {
    addCode(codeObj) {

      let domvals = {};       // Holds the contents of the next object to be created
      let domvalsGood = true; // Signals if domvals will have bad data or not

      // Get the value of the text boxes
      codeObj.inputModelProp.forEach((element, index) => {
        let domjquery = this.$("#" + codeObj.emberName + index);

        // Check that the element was found
        if (domjquery.length == 0) {
          domvalsGood = false;
          return;
        }

        let domval = domjquery.val();               // Retrieve value

        if (domval == "" || domval == undefined)    // Make sure it is not empty
          domvalsGood = false;
        else {
          if (element.type !== "model")
            domvals[element.name] = domval;           // Add to new object
          else
            domvals[element.name] = this.get('store').peekRecord(element.modelName, domval);  // Add the ember object corresponding to the ID
        }
      });

      console.debug(domvals);

      // If the text boxes aren't empty...
      if (domvalsGood) {
        // Create the new object
        var newObj = this.get('store').createRecord(codeObj.emberName, domvals);

        newObj.save().then((obj) => {
          // codeObj.list.pushObject(obj);

          // Clear input box on success
          codeObj.inputModelProp.forEach((element, index) => {
            let domjquery = this.$("#" + codeObj.emberName + index);

            // Check that the elemnt was found
            if (domjquery.length == 0) return;

            // Set text box value
            if (domjquery[0].nodeName.toLowerCase() == "input")
              domjquery.val("");
            else if (domjquery[0].nodeName.toLowerCase() == "select")
              domjquery.val(this.$("#" + codeObj.emberName + index + " option").val());
          });
          console.log("Added " + codeObj.emberName);
        }, function () {
          console.log("Could not add " + codeObj.emberName);
        });
      }
    },

    modifyCode(emberName, obj) {

      // If the object exists, save the new update to DB
      if (obj.get('id') !== "") {
        obj.save();
      }
    },

    deleteCode(emberName, genderId) {
      // Find the given record, then destroy it
      this.get('store').findRecord(emberName, genderId, { backgroundReload: false }).then(obj => {
        obj.destroyRecord().then(() => {
          // this.get('codes').find(el => el.emberName == emberName).list.removeObject(obj);
          console.log("Deleted " + emberName);
        });
      });
    }
  }
});
