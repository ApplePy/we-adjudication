import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  term: null,
  program: null,
  course: null,
  notDONE: null,
  selectedPlan: null,
  selectedLoad: null,
  selectedStatus: null,
  statusModel: null,
  loadModel: null,
  courses: null,

  actions:{
    selectLoad(load){
      this.set('selectedLoad', load);
    },

    selectStatus(status){
      this.set('selectedStatus', status);
    },

    saveRecord(object){
      object.save();
      this.set('notDONE', false);
      Ember.$('.ui.modal').modal('hide');
      Ember.$('.ui.modal').remove();
    },

    saveProgram(program){
      var load = this.get('store').peekRecord('course-load', this.get('selectedLoad'));
      var status = this.get('store').peekRecord('program-status', this.get('selectedStatus'));
      if(load === null){
        load = this.get('loadModel').objectAt(0);
      }
      if(status === null){
        status = this.get('statusModel').objectAt(0);
      }

      program.set('load', load);
      program.set('status', status);
      program.save();

      this.set('notDONE', false);
      Ember.$('.ui.modal').modal('hide');
      Ember.$('.ui.modal').remove();
    },

    close(object){
      object.rollbackAttributes();
      this.set('notDONE', false);
      Ember.$('.ui.modal').modal('hide');
      Ember.$('.ui.modal').remove();
    },

    closeCourse(course, grade){
      var g = this.get('store').peekRecord('grade', grade);
      g.rollbackAttributes();
      course.rollbackAttributes();
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
