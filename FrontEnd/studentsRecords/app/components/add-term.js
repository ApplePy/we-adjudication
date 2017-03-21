import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  notDONE: null,
  newTermName: null,
  student: null,
  terms: null,
  termCodes: null,
  selectedTerm: null,

  actions: {
    selectTerm(termID){
      var t = this.get('store').peekRecord('term-code', termID);
      this.set('selectedTerm', t);
    },

    saveRecord(){
      if(this.get('selectedTerm') === null){
        var firstTerm = this.get('termCodes').objectAt(0);
        this.set('selectedTerm', firstTerm);
      }

      var term = this.get('store').createRecord('term', {
        termCode: this.get('selectedTerm'),
        student: this.get('student')
      });

      var self = this;
      term.save().then(function(record){
        self.get('terms').pushObject(record);
      });

      this.set('notDONE', false);
      Ember.$('.ui.modal').modal('hide');
      Ember.$('.ui.modal').remove();
    },

    close(){
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
