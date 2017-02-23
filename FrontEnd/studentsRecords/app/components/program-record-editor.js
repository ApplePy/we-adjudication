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
  plans: null,

  init() {
    this._super(...arguments);

    var self = this;
    this.get('store').findAll('plan-code').then(function (records) {
      self.set('planModel', records);
    });

    this.get('store').findAll('program-status').then(function (records) {
      self.set('statusModel', records);
    });

    this.get('store').findAll('course-load').then(function (records) {
      self.set('loadModel', records);
    });
  },

  actions:{
    selectLoad(load){
      this.set('selectedLoad', load);
    },

    selectStatus(status){
      this.set('selectedStatus', status);
    },

    deletePlanField(){
      //pop off the last element of the plans array
      this.get('program').get('plan').popObject();
    },

    newPlanField(){
      //push the first element from the plans into the plans array
      this.get('program').pushObject(this.get('planModel').objectAt(0).id);

    },

    saveRecord(object){
      object.save();
      this.send('close');
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

      this.send('close');
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
