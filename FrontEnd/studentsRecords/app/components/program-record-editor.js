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
  selectedTerm: null,
  statusModel: null,
  loadModel: null,
  termCodes: null,
  courses: null,

  actions:{
    selectTerm(term){
      this.set('selectedTerm', term);
    },

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

    saveTerm(term){
      var t = this.get('store').peekRecord('term-code', this.get('selectedTerm'));
      if(t == null){
        term.save();
      } else {
        term.set('termCode', t);
        term.save();
      }
      this.set('notDONE', false);
      Ember.$('.ui.modal').modal('hide');
      Ember.$('.ui.modal').remove();
    },

    saveProgram(program){
      var load = this.get('store').peekRecord('course-load', this.get('selectedLoad'));
      var status = this.get('store').peekRecord('program-status', this.get('selectedStatus'));
      if(load !== null){
        program.set('load', load);
      }
      if(status !== null){
        program.set('status', status);
      }

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
