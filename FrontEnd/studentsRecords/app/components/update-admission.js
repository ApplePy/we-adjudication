import Ember from 'ember';

export default Ember.Component.extend({
    student: null,
    notDONE: null,
    store: Ember.inject.service(),

    actions: {
      saveAdmission() {
        this.get('store').findRecord('student', this.get('student').id).then((stu) => {
        stu.set('admissionAverage', this.get('student.admissionAverage'));
        stu.set('basisOfAdmission', this.get('student.basisOfAdmission'));
        stu.set('admissionComments', this.get('student.admissionComments'));
        stu.set('registrationComments', this.get('student.registrationComments'));
        stu.save();
 });
    this.set('notDONE', false);
     Ember.$('.ui.modal').modal('hide');
     Ember.$('.ui.modal').remove();
  },

   close: function() {
    this.set('notDONE', false);
     Ember.$('.ui.modal').modal('hide');
     Ember.$('.ui.modal').remove();
     this.get('student').rollbackAttributes();
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
