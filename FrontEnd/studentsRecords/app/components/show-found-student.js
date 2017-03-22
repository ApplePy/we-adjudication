import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    studentsModel: null,
    INDEX: null,
    notDONE: null,
    limit: 10,
    offset: 0,
    pageSize: 10,

 actions: {
  loadNext: function () {
      this.set('offset', this.get('offset') + this.get('pageSize'));
    },

    loadPrevious: function () {
      if (this.get('offset') >= this.get('pageSize')) {
        this.set('offset', this.get('offset') - this.get('pageSize'));
      }
    },

    getStudent: function (student) {
      var index = this.get('studentsModel').indexOf(student);
      this.set('INDEX', index);
    },

   exit: function () {
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
