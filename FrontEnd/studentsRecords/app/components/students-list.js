import Ember from 'ember';

export default Ember.Component.extend({

  store: Ember.inject.service(),

  // Passed in
  model: null,
  closeModal: null,
  
  selectedStudent: null,

  actions: {
    getStudent: function (student) {
      this.set('selectedStudent', student);
    },

    exit: function () {
      Ember.$('.ui.modal').modal('hide');
      Ember.$('.ui.modal').remove();
      this.get("closeModal")(this.selectedStudent);  // This hands back to students to handle rerouting
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
