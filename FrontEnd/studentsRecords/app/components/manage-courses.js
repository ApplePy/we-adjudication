import Ember from 'ember';

export default Ember.Component.extend({

  course: null,

  didRender() {
    Ember.$('.ui.modal').modal("refresh");
  }
});
