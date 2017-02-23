import Ember from 'ember';

export default Ember.Component.extend({
  term: null,
  program: null,
  course: null,
  notDONE: null,
  selectedPlan: null,
  planModel: ["Software Engineering", "Mechatronics Engineering", "Bio year 2"],
  courses: null,

  init() {
    this._super(...arguments);

    var self = this;
    self.set('selectedPlan', self.get('planModel').objectAt(0));

  },

  actions:{
    selectPlan(plan){
      this.set('selectedPlan', plan);
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

    saveRecord(object){
      object.save();
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
