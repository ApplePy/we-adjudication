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

      prog.save().then(function(record){

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
