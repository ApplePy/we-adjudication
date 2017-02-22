import Ember from 'ember';

export default Ember.Component.extend({
  courseToEdit: null,
  selectedCourse: null,
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

  actions:{
    selectCourse(course){
      console.log(this.get('courseModel').indexOf(course));
      this.set('selectedCourse', this.get('courseModel').objectAt(this.get('courseModel').indexOf(course)));
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
    }
  }
});
