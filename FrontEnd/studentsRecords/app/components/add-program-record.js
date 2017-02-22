import Ember from 'ember';

export default Ember.Component.extend({
  notDONE: null,
  newNote: null,
  plans: [],
  hasPlan: false,
  planModel: ["Software Engineering", "Mechatronics Engineering", "Bio year 2"],
  programModel: [],

  init() {
    this._super(...arguments);
    //set the plans array to empty
    this.set('plans', []);
  },

  actions:{
    selectRecord(record){

    },

    selectPlan(plan){

    },

    saveRecord(){

    },

    deletePlanField(){
      //pop off the last element of the plans array
      this.get('program').plan.popObject();
      //
      if(this.get('program').plan.length === 0){
        this.set('hasPlan', false);
      }
    },

    newPlanField(){
      //push the first element from the plans into the plans array
      this.get('program').plan.pushObject("Software Engineering");
      //show the removal button
      this.set('hasPlan', true);
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
