import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  notDONE: null,
  term: null,
  selectedLoad: null,
  selectedStatus: null,
  statusModel: null,
  loadModel: null,
  newName: null,
  newLevel: null,

  init() {
    this._super(...arguments);
    //set the plans array to empty
    var self = this;
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

    saveNewRecord(){
      var sLoad = this.get('selectedLoad');
      if(sLoad === null){
        sLoad = this.get('loadModel').objectAt(0).id;
      }
      var sStatus = this.get('selectedStatus');
      if(sStatus === null){
        sStatus = this.get('statusModel').objectAt(0).id;
      }
      var load = this.get('store').peekRecord('course-load', sLoad);
      var status = this.get('store').peekRecord('program-status', sStatus);
      var t = this.get('store').peekRecord('term-code', this.get('term').id);
      var prog = this.get('store').createRecord('program-record', {
        name: this.get('newName'),
        level: this.get('newLevel'),
        load: load,
        status: status
      });

      prog.save().then(function(record){
        t.get('programRecords').pushObject(record);
        t.save().then(function(record){});
      });

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
