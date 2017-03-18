import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  notDONE: null,
  codeToEdit: null,
  ruleModel: [],

 actions: {
  saveCode() {
        this.get('store').findRecord('assessment-code', this.get('codeToEdit').id).then((code) => {
        code.set('code', this.get('codeToEdit.code'));
        code.set('name', this.get('codeToEdit.name'));
        code.save();
      });

    this.set('notDONE', false);
    Ember.$('.ui.modal').modal('hide');
    Ember.$('.ui.modal').remove();

  },

   close: function() {
     this.set('notDONE', false);
     Ember.$('.ui.modal').modal('hide');
     Ember.$('.ui.modal').remove();
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
