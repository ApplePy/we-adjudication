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
      val: "",
      description: ""
    },
    {
      id: 1,
      val: "&&",
      description: "AND"
    },
    {
      id: 2,
      val: "||",
      description: "OR"
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
      rule.logicalLink = this.get('links')[link].description;
      rule.save();
      if(link != 0){
        this.set('isAdding', false);
        this.set('addedRule', false);
      }
    },

    savePlan(){
      if(this.get('selectedPlan') === null){
        var firstPlan = this.get('planModel').objectAt(0);
        this.set('selectedPlan', firstPlan);
      }

      //Check to see if there is a rule to be set as the parent
      var code = this.get('store').peekRecord('assessment-code', this.get('program'));

      if(code.get('logicalExpressions').get('length') > 0){
        var rule = code.get('logicalExpressions').get('lastObject');
        rule.set('parentExpression', this.get('selectedPlan'));
      }

     var updatedProgram = this.get('store').peekRecord('assessment-code', this.get('program'));
     var rule = this.get('store').peekRecord('logical-expression', this.get('selectedPlan').id);
      if(updatedProgram.get('logicalExpressions').get('length') > 0){
        var lastRule = updatedProgram.get('logicalExpressions').get('lastObject');
        rule.set('parentExpression', lastRule);
      } else {
        rule.set('parentExpression', null);
      }
     rule.set('logicalLink', null);
     rule.set('assessmentCode', updatedProgram);
     rule.save();

      this.set('isAdding', false);
      this.set('selectedPlan', null);
      this.set('addedRule', true);

    },
    cancelAdd(){
      this.set('isAdding', false);
      this.set('addedRule', true);
    }

  }
});
