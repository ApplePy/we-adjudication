import Ember from 'ember';

export default Ember.Component.extend({

  store: Ember.inject.service(),

  actions: {
    save() {
      console.log("hello");
      alert('hello');
    }
  }

});
