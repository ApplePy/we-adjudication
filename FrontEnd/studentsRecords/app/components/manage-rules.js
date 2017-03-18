import Ember from 'ember';

export default Ember.Component.extend({
  rules: null,
  isAdding: false,

  actions:{
    add(){
      this.set('isAdding', true);
    },
  },

});
