import Ember from 'ember';

export default Ember.Component.extend({
    showHelp: false,

   actions: {
       clicked() {
           this.set('showHelp', true);
       }
   }
});
