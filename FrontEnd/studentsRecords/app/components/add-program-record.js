import Ember from 'ember';

export default Ember.Component.extend({
  notDONE: null,
  genderModel: null,
  residencyModel: null,
  newNote: null,
  plans: [],
  hasPlan: false,

  init() {
    this._super(...arguments);
    //set the plans array to empty
    this.set('plans', []);
  },

  actions:{
    selectRecord(record){

    },

    selectCourse(course){

    },

    selectTerm(term){

    },

    selectPlan(plan){

    },

    saveRecord(){

    },

    deletePlanField(){
      //pop off the last element of the plans array
      this.get('plans').popObject();
      //
      if(this.get('plans').length === 0){
        this.set('hasPlan', false);
      }
    },

    newPlanField(){
      //push the first element from the plans into the plans array
      this.get('plans').pushObject("newPlan");
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
