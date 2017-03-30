import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  lists: { },                               // A dictionary that holds the lists of the ember models
  codes: [],
  init() {

    this._super(...arguments);
    
    // List population
    let getAll = emberName => {
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
                .then(() => Ember.set(this.get('lists'), emberName, this.get('store').peekAll(emberName)));
            }
            else {
              Ember.set(this.get('lists'), emberName, this.get('store').peekAll(emberName));
            }
          });
      }
    };

    // Populate each type of system code with it's list
    for (let entry of this.codes) {
      /*jshint loopfunc: true */  // Shuts up jshint, since this dynamic function generation in a loop is needed
      getAll(entry.emberName);

      // Make sure all models that depend on other models are loaded
      for (let prop of entry.inputModelProp) {
        if (prop.type === "model") {
          getAll(prop.modelName);
        }
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
        if (domjquery.length === 0) {
          domvalsGood = false;
          return;
        }

        let domval = domjquery.val();               // Retrieve value

        if (domval === "" || domval === undefined) {    // Make sure it is not empty
          domvalsGood = false;
        }
        else {
          if (element.type !== "model") {
            domvals[element.name] = domval;           // Add to new object
          }
          else {
            domvals[element.name] = this.get('store').peekRecord(element.modelName, domval);  // Add the ember object corresponding to the ID
          }
        }
      });

      console.debug(domvals);

      // If the text boxes aren't empty...
      if (domvalsGood) {
        // Create the new object
        var newObj = this.get('store').createRecord(codeObj.emberName, domvals);

        newObj.save().then(() => {
          // codeObj.list.pushObject(obj);

          // Clear input box on success
          codeObj.inputModelProp.forEach((element, index) => {
            let domjquery = this.$("#" + codeObj.emberName + index);

            // Check that the elemnt was found
            if (domjquery.length === 0) {
              return;
            }

            // Set text box value
            if (domjquery[0].nodeName.toLowerCase() === "input") {
              domjquery.val("");
            }
            else if (domjquery[0].nodeName.toLowerCase() === "select") {
              // Create a default object with the placeholder option name instead
              domjquery.val(this.$("#" + codeObj.emberName + index + " option").val());
            }
          });
          console.log("Added " + codeObj.emberName);
        }, function () {
          console.log("Could not add " + codeObj.emberName);
        });
      }
    }
  }
});
