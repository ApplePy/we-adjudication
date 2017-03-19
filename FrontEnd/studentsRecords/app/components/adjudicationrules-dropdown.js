import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  program: null,
  selectedPlan: null,
  planModel: null,
  isAdding: false,
  addedRule: null,
  links: [
    {
      id: 0,
      val: "&&",
      description: "and"
    },
    {
      id: 1,
      val: "||",
      description: "or"
    }
  ],

  actions:{
    selectPlan(planId){
      var p = this.get('store').peekRecord('logical-expression', planId);
      this.set('selectedPlan', p);
    },

    addPlan(){
      this.set('isAdding', true);
    },

    selectLink(link){
      var code = this.get('store').peekRecord('assessment-code', this.get('program'));
      var rule = code.get('logicalExpressions').get('lastObject');
      console.log(this.get('links')[link].description);
      rule.logicalLink = this.get('links')[link].description;
      rule.save();
      this.set('isAdding', false);
      this.set('addedRule', false);
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
     rule.set('logicalLink', null);
     rule.set('assessmentCode', updatedProgram);
     rule.save();

      this.set('isAdding', false);
      this.set('selectedPlan', null);
      this.set('addedRule', true);

    },

    cancelAdd(){
      this.set('isAdding', false);
    }

  }
});
