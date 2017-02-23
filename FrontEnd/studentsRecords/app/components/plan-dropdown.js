import Ember from 'ember';

export default Ember.Component.extend({
  plan: null,
  planModel: null,

  actions:{
    selectPlan(_plan){
      this.set('plan', _plan);
      console.log(this.get('plan'));
    }
  }
});
