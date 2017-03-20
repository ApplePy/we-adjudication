import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  codeModel: [],
  booleanExp: null,

  init(){
    this._super(...arguments);

    this.get('store').query('assessment-code', {limit: 10}).then((records) => {
      let totalRecords = records.get('meta').total;
      let offsetUsed = records.get('meta').offset;
      let limitUsed = records.get('meta').limit;
      this.get('store').query('assessment-code', {limit: totalRecords}).then((rules) => {
        for(var i=0; i < rules.get('length'); i++){
          this.get('codeModel').pushObject(rules.objectAt(i));
        }
      });
    });

    this.get('store').query('logical-expression', {limit: 10}).then((records) => {
      let totalRecords = records.get('meta').total;
      let offsetUsed = records.get('meta').offset;
      let limitUsed = records.get('meta').limit;
      this.get('store').query('logical-expression', {limit: totalRecords}).then((rules) => {
        for(var i=0; i < rules.get('length'); i++){

        }
      });
    });
  },

  actions:{

    loop(){
      for(var i=0; i < this.get('codeModel').get('length'); i++){
        for(var j=0; j < this.get('codeModel').objectAt(i).get('logicalExpressions').get('length'); j++){
          var ruleObj = this.get('codeModel').objectAt(i).get('logicalExpressions').objectAt(j);
          var rule = ruleObj.get('booleanExp');
          for(var k=0; k < rule.length; k++){
            //Get a boolean expression from the
            var m = rule.indexOf('(', k);
            k = rule.indexOf(')', m);
            var exp = rule.substr(m,k - m);
            var endParam = exp.indexOf(' ') - 1
            var param = exp.substr(1, endParam);
            var endOpr = exp.indexOf(" ", endParam + 2);
            var opr = exp.substr(endParam + 2, endOpr - endParam - 2);
            var value = exp.substr(endOpr + 1);
            var link = rule.substr(k + 2, rule.indexOf(' ', k + 2) - k - 2);
          }
          var logicalLink = ruleObj.get('logicalLink');
        }
      }
    }
  },

  modelDictionary: ['yass']
});
