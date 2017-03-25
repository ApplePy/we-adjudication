import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  notDONE: null,
  codeToEdit: null,
  ruleModel: [],
  codeModel: null,

 actions: {
  saveCode() {
    this.get('codeToEdit').save();
   // this.send('reloadArray'); <- this is the line
    this.set('notDONE', false);
    Ember.$('.ui.modal').modal('hide');
    Ember.$('.ui.modal').remove();

  },

   close: function() {
     this.get('codeToEdit').rollbackAttributes();
     this.send('reloadArray');
     this.set('notDONE', false);
     Ember.$('.ui.modal').modal('hide');
     Ember.$('.ui.modal').remove();
   },

   reloadArray(){
      this.set('codeModel', this.get('store').peekAll('assessment-code'));
   },

    deleteRule(ruleToDel) {
      let rule = this.get('store').peekRecord('logical-expression', ruleToDel.id);
      rule.set('assessmentCode', null);
      rule.save();

      if(this.get('codeToEdit').get('logicalExpressions').get('length') > 0){
        var lastRule = this.get('codeToEdit').get('logicalExpressions').get('lastObject');
        lastRule.set('logicalLink', null);
      }
      this.set('addedRule', false);
    }

  },
  didRender() {
    Ember.$('.ui.modal')
      .modal({
        closable: false,
      })
      .modal('show');
  }
});
