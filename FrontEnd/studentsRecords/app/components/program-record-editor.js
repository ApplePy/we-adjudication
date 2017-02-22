import Ember from 'ember';

export default Ember.Component.extend({
  term: null,
  program: null,
  course: null,
  notDONE: null,
  courseToEdit: null,
  selectedCourse: null,
  selectedPlan: null,
  planModel: ["Software Engineering", "Mechatronics Engineering", "Bio year 2"],
  courseModel: [{
    courseLetter: "SE",
    courseNumber: 2500,
    name: "Software eng",
    unit: 0.5
  },
    {
      courseLetter: "ES",
      courseNumber: 1050,
      name: "Design",
      unit: 2
    },
    {
      courseLetter: "Math",
      courseNumber: 102,
      name: "Mathematics",
      unit: 0.5
    }
  ],

  init() {
    this._super(...arguments);

    this.set('selectedCourse', this.get('courseModel').objectAt(0));
    this.set('selectedPlan', this.get('planModel').objectAt(0));

  },

  actions:{
    selectPlan(plan){
      this.set('selectedPlan', plan);
    },

    selectCourse(course){

      this.set('selectedCourse', c);
    },

    newCourse(){

    },

    editCourse(){
      this.set('courseToEdit', this.get('selectedCourse'));
    },

    deleteCourse(course){

    },

    saveCourseToEdit(){
      //this.get('courseToEdit').save();
    },

    cancelCourseEdit(){
      this.set('courseToEdit', null);
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
      //object.save();
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
