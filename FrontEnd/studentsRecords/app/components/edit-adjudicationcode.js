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
    this.send('reloadArray');
    this.set('notDONE', false);
    Ember.$('.ui.modal').modal('hide');
    Ember.$('.ui.modal').remove();

  },

   close: function() {
     this.get('codeToEdit').rollbackAttributes();
     this.set('notDONE', false);
     Ember.$('.ui.modal').modal('hide');
     Ember.$('.ui.modal').remove();
   },

   reloadArray(){
      this.set('codeModel', this.get('store').peekAll('assessment-code'));
   },

    deleteRule(ruleToDel) {
      let code = this.get('store').peekRecord('assessment-code', this.get('codeToEdit').id);
      let rule = this.get('store').peekRecord('logical-expression', ruleToDel.id);
      code.get('logicalExpressions').removeObject(rule);
      code.save();
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
