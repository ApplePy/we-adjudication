import Ember from 'ember';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  codeObj: {},
  lists: {},

  content: Ember.computed("lists", "codeObj", "lists[codeObj.emberName]", function() {
    // Quick sanity check
    if (typeof this.codeObj.emberName !== "undefined") {
      return this.get('store').findAll(this.codeObj.emberName);
    }
  }),

  // can be called anything, I've called it pagedContent
  // remember to iterate over pagedContent in your template
  pagedContent: pagedArray('content', {
    perPage: 10
  }),

  actions: {
    modifyCode(emberName, obj, index) {
      // Elements that the data is coming from
      let inputEleDiv = this.$("." + emberName + index);

      // Clear old states
      Ember.$("[class*='error']", inputEleDiv.parent()).removeClass('error');
      Ember.$("[class*='success']", inputEleDiv).remove();

      // If the object exists, save the new update to DB
      if (obj.get('id') !== "") {
        obj.save().then(() => {
          // Add a green checkmark on sucess to input boxes
          inputEleDiv.append('<i class="ui green check circle outline icon success"></i>');

          // Disable save modification button
          Ember.$("[class*='buttonmodify']", inputEleDiv.parent()).prop('disabled', true);
        }).catch(() => {
          // Mark all the entry boxes with error colours
          inputEleDiv.addClass("error");
        });
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
    },

    resetState(jquery) {
      // Remove all colouring and objects from the DOM when an entry button was clicked
      let object = Ember.$(jquery.target).parent().parent();
      Ember.$("[class*='error']", object).removeClass('error');
      Ember.$("[class*='success']", object).remove();

      // Enable save modification button
      Ember.$("[class*='buttonmodify']", object).prop('disabled', false);
    }
  }
});
