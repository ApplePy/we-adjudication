import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  ruleArray: null,
  rulesToBeAdded: [],
  selectedOpr: null,
  selectedParam: null,
  devBool: null,
  confirming: null,
  notDONE: null,

  parameters: [
    {
      id: 0, oprs: [{id: 0, description: "=="}, {id: 1, description: "!="}], description: "CourseLetter"
    },
    {
      id: 1, oprs: [{id: 0, description: "=="}, {id: 1, description: "!="}], description: "CourseNumber"
    },
    {
      id: 2, oprs: [{id: 0, description: "=="}, {id: 1, description: "!="}], description: "CourseName"
    },
    {
      id: 3, oprs: [
                    {id: 0, description: ">"},
                    {id: 1, description: ">="},
                    {id: 2, description: "=="},
                    {id: 3, description: "<="},
                    {id: 4, description: "<"},
                    {id: 5, description: "!="}],
      description: "CourseUnit"
    },
    {
      id: 4, oprs: [
                    {id: 0, description: ">"},
                    {id: 1, description: ">="},
                    {id: 2, description: "=="},
                    {id: 3, description: "<="},
                    {id: 4, description: "<"},
                    {id: 5, description: "!="}],
      description: "Mark"
    },
    {
      id: 5, oprs: [{id: 0, description: "=="}, {id: 1, description: "!="}], description: "ProgramName"
    },
    {
      id: 6, oprs: [{id: 0, description: "=="}, {id: 1, description: "!="}], description: "ProgramLevel"
    },
    {
      id: 7, oprs: [{id: 0, description: "=="}, {id: 1, description: "!="}], description: "ProgramLoad"
    },
    {
      id: 8, oprs: [{id: 0, description: "=="}, {id: 1, description: "!="}], description: "ProgramStatus"
    },
    {
      id: 9, oprs: [{id: 0, description: "=="}, {id: 1, description: "!="}], description: "Plan"
    },
    {
      id: 10, oprs: [{id: 0, description: "=="}, {id: 1, description: "!="}], description: "Rule"
    },
    {
      id: 11, oprs: [{id: 0, description: ">"},
      {id: 1, description: ">="},
      {id: 2, description: "=="},
      {id: 3, description: "<="},
      {id: 4, description: "<"},
      {id: 5, description: "!="}],
      description: "TermAverage"
    }
  ],
  /*
  Parameters to be added if needed/required!!! (Cumulative Average, Term Average, and a course letter and number)
   {
   id: 1, oprs: [{id: 0, description: "=="}, {id: 1, description: "!="}], description: "CourseLetterAndNumber"
   },
   {
   id: 5, oprs: [
   {id: 0, description: ">"},
   {id: 1, description: ">="},
   {id: 2, description: "=="},
   {id: 3, description: "<="},
   {id: 4, description: "<"},
   {id: 5, description: "!="}],
   description: "CumulativeAverage"
   },
  */
  oprs: [],
  links: [
    {
      id: 0,
      val: "&&",
      description: "AND"
    },
    {
      id: 1,
      val: "||",
      description: "OR"
    }
  ],
  newValue: null,

  init(){
    this._super(...arguments);
    this.set('devBool', true);
    this.set('confirming', false);
    this.set('rulesToBeAdded', []);
    this.set('selectedParam', null);
    this.set('selectedOpr', null);
  },

  actions:{
    addRule(){
      if(this.get('selectedOpr') !== null && this.get('selectedParam') !== null && this.get('newValue') !== null){
        if(this.get('selectedParam').description === "Rule"){
          this.set('newValue', '[' + this.get('newValue') + ']');
        }
        var rule = {
          parameter: this.get('selectedParam'),
          opr: this.get('selectedOpr'),
          value: this.get('newValue'),
          link: null
        };
        this.get('rulesToBeAdded').pushObject(rule);
        this.set('newValue', null);
        this.set('devBool', false);
      } else {

      }
    },
    selectOpr(opr){
      var obj = this.get('oprs')[opr];
      this.set('selectedOpr', obj);
    },

    selectLink(link){
        var obj = this.get('links')[link];
        var rule = this.get('rulesToBeAdded').get('lastObject');
        var newRule = {
          parameter: rule.parameter,
          opr: rule.opr,
          value: rule.value,
          link: obj
        };
        this.get('rulesToBeAdded').popObject();
        this.get('rulesToBeAdded').pushObject(newRule);
        this.set('devBool', true);
    },

    selectParam(param){
      var obj = this.get('parameters')[param];
      this.set('oprs', obj.oprs);
      this.set('selectedParam', obj);
    },

    cancelLink(){
      var rule = this.get('rulesToBeAdded').get('lastObject');
      var newRule = {
        parameter: rule.parameter,
        opr: rule.opr,
        value: rule.value,
        link: null
      };
      this.get('rulesToBeAdded').popObject();
      this.get('rulesToBeAdded').pushObject(newRule);
      this.set('devBool', false);
    },

    removeRule(rule){
      this.set('rulesToBeAdded', this.get('rulesToBeAdded').without(rule));
      this.set('confirming', false);
      this.set('devBool', true);
    },

    doneAdding(){
      this.set('confirming', true);
    },

    saveRule(){
      //Set up the boolean expression
      var rules = this.get('rulesToBeAdded');
      var expression = "";
      for(var i=0; i < rules.length; i++){
        var rule = rules.objectAt(i);
        expression += "(" + rule.parameter.description + " " + rule.opr.description + " " + rule.value + ")";
        if(rule.link != null){
          expression += ' ' + rule.link.description + ' ';
        }
      }
      //Create a new logical expression using the expression
      var newRule = this.get('store').createRecord('logical-expression', {
        booleanExp: expression,
        logicalLink: null,
        assessmentCode: null
      });

      var self = this;
      newRule.save().then(function(record){
        self.get('ruleArray').pushObject(record);
      });

      this.set('notDONE', false);
    },

    notConfirmed(){
      this.set('confirming', false);
    },

    cancel(){
      this.set('notDONE', false);
    }
  }

});
