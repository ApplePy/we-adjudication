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
  sampleProgram: null,

  init() {
    this._super(...arguments);
    //set the plans array to empty
    var self = this;
    this.set('plans',[]);
    this.get('store').findAll('plan-code').then(function (records) {
      self.set('planModel', records);
    });

    this.get('store').findAll('program-record').then(function (records) {
      self.set('programModel', records);
    });

    this.get('store').findAll('program-status').then(function (records) {
      self.set('statusModel', records);
    });

    this.get('store').findAll('course-load').then(function (records) {
      self.set('loadModel', records);
    });

  },

  actions:{
    selectRecord(record){
      var rec = this.get('store').peekRecord('program-record', record);
      this.set('sampleProgram', rec);
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
      if(load === null){
        load = this.get('loadModel').objectAt(0);
      }
      if(status === null){
        status = this.get('statusModel').objectAt(0);
      }
      var prog = this.get('store').createRecord('program-record', {
        name: this.get('newName'),
        level: this.get('newLevel'),
      });
      prog.set('load', load);
      prog.set('status', status);
      prog.get('semester').pushObject(this.get('term'));

      for(var i = 0; i < this.get('plans').length; i++){
        var plan = this.get('store').peekRecord('plan-code', this.get('plans').objectAt(i));
        prog.get('plan').pushObject(plan);
      }

      this.set('sampleProgram', prog);

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
