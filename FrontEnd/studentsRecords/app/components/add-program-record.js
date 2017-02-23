import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  notDONE: null,
  newNote: null,
  plans: null,
  term: null,
  planModel: null,
  selectedPlan: null,
  selectedProgram: null,
  selectedLoad: null,
  selectedStatus: null,
  programModel: null,
  statusModel: null,
  loadModel: null,
  newName: null,
  newLevel: null,

  init() {
    this._super(...arguments);
    //set the plans array to empty
    var self = this;
    this.set('plans',[]);
    this.get('store').findAll('plan-code').then(function (records) {
      self.set('planModel', records);
      if(records.length > 0){
        self.set('selectedPlan', records.objectAt(0).id);
      }
    });

    this.get('store').findAll('program-record').then(function (records) {
      self.set('programModel', records);
      if(records.length > 0){
        self.set('selectedProgram', records.objectAt(0).id);
      }
    });

    this.get('store').findAll('program-status').then(function (records) {
      self.set('statusModel', records);
      if(records.length > 0){
        self.set('selectedStatus', records.objectAt(0).id);
      }
    });

    this.get('store').findAll('course-load').then(function (records) {
      self.set('loadModel', records);
      if(records.length > 0){
        self.set('selectedLoad', records.objectAt(0).id);
      }
    });

  },

  actions:{
    selectRecord(record){

    },

    selectLoad(load){
      this.set('selectedLoad', load);
    },

    selectStatus(status){
      this.set('selectedStatus', status);
    },

    saveNewRecord(){
      var load = this.get('store').peekRecord('course-load', this.get('selectedLoad'));
      var status = this.get('store').peekRecord('program-status', this.get('selectedStatus'));
      var prog = this.get('store').createRecord('program-record', {
        name: this.get('newName'),
        level: this.get('newLevel'),
        load: load,
        status: status,
      });

      prog.get('semester').pushObject(this.get('term'));

      for(var i = 0; i < this.get('plans').length; i++){
        var plan = this.get('store').peekRecord('plan-code', this.get('plans').objectAt(i));
        prog.get('plan').pushObject(plan);
      }

      prog.save().then(function(record){

      });

      this.send('close');
    },

    saveRecord(){

    },

    deletePlanField(){
      //pop off the last element of the plans array
      this.get('plans').popObject();
    },

    newPlanField(){
      //push the first element from the plans into the plans array
      this.get('plans').pushObject(this.get('planModel').objectAt(0).id);
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
