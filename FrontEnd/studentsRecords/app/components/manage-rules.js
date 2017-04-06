import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  rules: [],
  isAdding: false,
  isUpdating: false,
  ruleToEdit: null,

  init() {
    this._super(...arguments);

    this.set('rules', []);

    this.get('store').query('logical-expression', {limit: 10}).then((records) => {
      let totalRecords = records.get('meta').total;
      let offsetUsed = records.get('meta').offset;
      let limitUsed = records.get('meta').limit;
      this.get('store').query('logical-expression', {limit: totalRecords}).then((rules) => {
        for(var i=0; i < rules.get('length'); i++){
          this.get('rules').pushObject(rules.objectAt(i));
        }
      });
    });
  },

  actions:{
    add(){
      this.set('isAdding', true);
    },

    updateRule(rule){
      this.set('isUpdating', true);
      this.set('ruleToEdit', rule);
    },

    deleteRule(rule){
      var self = this;
      this.get('store').findRecord('logical-expression', rule.id, { backgroundReload: false }).then(function(obj) {
        obj.destroyRecord().then(function(object) {
          console.log("Deleted rule");
          self.set('rules', self.get('rules').without(object));
        });
      });
    },
  },

});
