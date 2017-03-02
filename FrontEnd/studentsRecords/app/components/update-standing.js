import Ember from 'ember';

export default Ember.Component.extend({
    updatestanding: null,
    notDONE: null,
    store: Ember.inject.service(),

    actions: {
      saveCourse() {
        this.get('store').findRecord('advanced-standing', this.get('updatestanding').id).then((standing) => {
        standing.set('course', this.get('updatestanding.course'));
        standing.set('description', this.get('updatestanding.description'));
        standing.set('units', this.get('updatestanding.units'));
        standing.set('grade', this.get('updatestanding.grade'));
        standing.set('from', this.get('updatestanding.from'));
        standing.save();
      });

    this.set('notDONE', false);
     Ember.$('.ui.modal').modal('hide');
     Ember.$('.ui.modal').remove();
  },

   close: function() {
    this.set('notDONE', false);
     Ember.$('.ui.modal').modal('hide');
     Ember.$('.ui.modal').remove();
     this.get('updatestanding').rollbackAttributes();
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
