import Ember from 'ember';

export default Ember.Component.extend({
    ruleModel: [],
    codeModel: [],
    addNewCode: false,
    store: Ember.inject.service(),
    isDeletePressed: false,
    code: null,
    isEditPressed: false,
    booleanExp: null,
      logicalLink: null,

   init() {
    this._super(...arguments);
    this.set('codeModel', []);
    this.set('ruleModel', []);

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
        this.get('ruleModel').pushObject(rules.objectAt(i));
      }
    });
  });

  }, 

 actions: {
     editCode(codeToEdit) {
          this.set('isEditPressed', true);
           this.set('code', codeToEdit);
     },

     deleteCode() {
       this.set('codeModel', this.get('codeModel').without(this.get('code')));
        this.get('store').findRecord('assessment-code', this.get('code').id, { backgroundReload: false }).then(function(code) {
        code.deleteRecord();
       code.save();
      });
     },

     addNewCode() {
         this.set('addNewCode', true);
     },

     deletePressed(id) {
       this.set('isDeletePressed', true);
       this.set('code', id);
     }
 }
});
