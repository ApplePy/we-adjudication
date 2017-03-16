import Ember from 'ember';

export default Ember.Component.extend({
  rules: null,
  isAdding: false,
  newValue: "",
  rulesToBeAdded: [],
  selectedOpr: null,
  selectedParam: null,
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
      description: "Grades"
    },
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
  newValue: null,

  init(){
    this._super(...arguments);
    this.set('selectedParam', null);
    this.set('selectedOpr', null);
  },

  actions:{
    add(){
      this.set('isAdding', true);
    },

    addRule(){
      if(this.get('selectedOpr') !== null && this.get('selectedParam') !== null && this.get('newValue') !== null){
        var rule = {
          parameter: this.get('selectedParam'),
          opr: this.get('selectedOpr'),
          value: this.get('newValue')
        };
        this.get('rulesToBeAdded').pushObject(rule);

      } else {

      }
    },

    selectOpr(opr){
      var obj = this.get('oprs')[opr];
      this.set('selectedOpr', obj);
    },

    selectParam(param){
      var obj = this.get('parameters')[param];
      this.set('selectedParam', obj);
    }
  },

});
