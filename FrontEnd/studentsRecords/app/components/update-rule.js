import Ember from 'ember';

export default Ember.Component.extend({
  notDONE: null,
  rule: null,
  links: [
    {
      id: 0,
      val: "",
      description: ""
    },
    {
      id: 1,
      val: "&&",
      description: "AND"
    },
    {
      id: 2,
      val: "||",
      description: "OR"
    }
  ],

  actions:{
    saveRecord(){
      this.get('rule').save();
      this.set('notDONE', false);
      Ember.$('.ui.modal').modal('hide');
      Ember.$('.ui.modal').remove();
    },

    selectLink(link){
      this.get('rule').set('logicalLink', this.get('links')[link].description);
      this.set('isAdding', false);
      this.set('addedRule', false);
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
