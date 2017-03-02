import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  program: null,
  selectedPlan: null,
  planModel: null,
  isAdding: false,

  actions:{
    selectPlan(planId){
      var p = this.get('store').peekRecord('plan-code', planId);
      this.set('selectedPlan', p);
    },

    addPlan(){
      this.set('isAdding', true);
    },

    savePlan(){
      if(this.get('selectedPlan') === null){
        var firstPlan = this.get('planModel').objectAt(0);
        this.set('selectedPlan', firstPlan);
      }
      var updatedProgram = this.get('store').peekRecord('program-record', this.get('program'));
      updatedProgram.get('plan').pushObject(this.get('selectedPlan'));
      updatedProgram.save();
      this.set('isAdding', false);
      this.set('selectedPlan', null);
    },

    cancelAdd(){
      this.set('isAdding', false);
    }

  }
});
