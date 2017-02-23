import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  plan: null,
  planModel: null,

  init() {
    this._super(...arguments);

    var self = this;
    this.get('store').findAll('plan-code').then(function (records) {
      self.set('planModel', records);
    });
  },

  actions:{
    selectPlan(_plan){
      this.set('plan', _plan);
      console.log(this.get('plan'));
    }
  }
});
