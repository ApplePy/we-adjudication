import Ember from 'ember';

export default Ember.Component.extend({
  notDONE: null,
  genderModel: null,
  residencyModel: null,
  newNote: null,
  plans: [],
  hasPlan: false,

  actions:{
    selectRecord(){

    },

    selectCourse(){

    },

    selectTerm(){

    },

    selectPlan(){

    },

    deletePlanField(){
      this.get('plans').popObject();
      if(this.get('plans').length === 0){
        this.set('hasPlan', false);
      }
    },

    newPlanField(){
      this.get('plans').pushObject("newPlan");
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
