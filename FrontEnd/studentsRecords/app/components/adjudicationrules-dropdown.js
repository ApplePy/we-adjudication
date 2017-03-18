import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  program: null,
  selectedPlan: null,
  planModel: null,
  isAdding: false,

  actions:{
    selectPlan(planId){
      var p = this.get('store').peekRecord('logical-expression', planId);
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
/*

     var updatedProgram = this.get('store').peekRecord('assessment-code', this.get('program'));
     console.log(updatedProgram.get('logicalExpressions'));
     updatedProgram.get('logicalExpressions').pushObject(this.get('selectedPlan'));
     console.log(updatedProgram);
     console.log(updatedProgram.get('logicalExpressions'));
     updatedProgram.save(); */

     var updatedProgram = this.get('store').peekRecord('assessment-code', this.get('program'));
     var rule = this.get('store').peekRecord('logical-expression', this.get('selectedPlan').id);
     rule.set('assessmentCode', updatedProgram);
     rule.save(); 

      this.set('isAdding', false);
      this.set('selectedPlan', null);
    },

    cancelAdd(){
      this.set('isAdding', false);
    }

  }
});