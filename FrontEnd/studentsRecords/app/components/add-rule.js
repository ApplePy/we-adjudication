import Ember from 'ember';

export default Ember.Component.extend({
  rulesToBeAdded: [],
  selectedOpr: null,
  selectedParam: null,
  devBool: true,
  confirming: false,
  notDONE: null,

  parameters: [
    {
      id: 0,
      val: "Program",
      description: "Program"
    },
    {
      id: 1,
      val: "adjudication.termAvg",
      description: "Term Average"
    },
    {
      id: 2,
      val: "course.grade",
      description: "Grade"
    },
    {
      id: 3,
      val: "course",
      description: "Course"
    }
  ],
  oprs: [
    {
      id: 0,
      val: '>',
      description: 'greater than'
    },
    {
      id: 1,
      val: ">=",
      description: "greater than or equal to"
    },
    {
      id: 2,
      val: "==",
      description: "equals"
    },
    {
      id: 3,
      val: "<=",
      description: "less than or equal to"
    },
    {
      id: 4,
      val: "<",
      description: "less than"
    },
    {
      id: 5,
      val: "!=",
      description: "not equal"
    }
  ],
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
  newValue: null,

  init(){
    this._super(...arguments);
    this.set('selectedParam', null);
    this.set('selectedOpr', null);
  },

  actions:{
    addRule(){
      if(this.get('selectedOpr') !== null && this.get('selectedParam') !== null && this.get('newValue') !== null){
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
      if(link === "done"){
        this.set('confirming', true);

      } else {
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
      }
    },

    selectParam(param){
      var obj = this.get('parameters')[param];
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

    saveRule(){
      //Set up the boolean expression 

    },

    cancel(){
      this.set('notDONE', false);
    }
  }

});
