import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  notDONE: null,
  newNote: null,
  plans: null,
  term: null,
  planModel: null,
  selectedPlan: null,

  programModel: [],

  init() {
    this._super(...arguments);
    //set the plans array to empty
    var self = this;
    this.set('plans',[]);
    this.get('store').findAll('plan-code').then(function (records) {
      self.set('planModel', records);
      self.set('selectedPlan', records.objectAt(0).id);
    });
  },

  actions:{
    selectRecord(record){
      console.log(this.get('selectedPlan'));
    },

    selectPlan(plan){
      console.log(this.get('selectedPlan'));
      this.set('selectedPlan', plan);
      console.log(this.get('selectedPlan'));
    },

    saveRecord(){

    },

    deletePlanField(){
      //pop off the last element of the plans array
      this.get('program').plan.popObject();
    },

    newPlanField(){
      //push the first element from the plans into the plans array
      this.get('program').plan.pushObject(this.get('planModel').objectAt(0));
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
