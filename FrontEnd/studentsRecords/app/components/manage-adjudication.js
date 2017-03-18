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
/*
this.set('booleanExp', "EXP");
     this.set('logicalLink', "LINK");

     var rule = this.get('store').createRecord('logical-expression', {
      booleanExp: this.get('booleanExp'),
      logicalLink: this.get('logicalLink')
      }); */

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




/*
     this.get('store').findAll('assessment-code').then((codes) => {
     for(var i = 0; i < codes.get('length'); i++) {
          this.get('codeModel').pushObject(codes.objectAt(i));
        }
    });  */

    // var self = this;
     /* rule.save().then(function(record){
      self.get('ruleModel').pushObject(record);
      });  */
     // rule.save();
   /* 
    this.get('store').findAll('logical-expression').then((rules) => {
     for(var i = 0; i < rules.get('length'); i++) {
          this.get('ruleModel').pushObject(rules.objectAt(i));
        }
    }); */
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
