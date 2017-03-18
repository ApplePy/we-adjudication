import Ember from 'ember';

export default Ember.Component.extend({
  notDONE: null,
  rule: null,

  actions:{
    saveRecord(){
      this.get('rule').save();
      this.set('notDONE', false);
      Ember.$('.ui.modal').modal('hide');
      Ember.$('.ui.modal').remove();
    },

    close(){
      this.get('rule').rollbackAttributes();
      this.set('notDONE', false);
      Ember.$('.ui.modal').modal('hide');
      Ember.$('.ui.modal').remove();
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
