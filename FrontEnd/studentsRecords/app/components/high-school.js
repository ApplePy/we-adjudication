import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  student: null,
  marks: [],
  editGrade: null,
  updateCourse: null,
  showMore: null,

  init() {
    this._super(...arguments);

    //*********************** POPULATE hsMarks[] **************************************
    //you do this so the student-data-entry.hsb file knows whats up and can use the array to loop
    //this is the same logic as awards and advanced standing so it should work (but of course it hasnt been tested yet)
    this.get('store').query('hs-grade', {
      filter: {
        recipient: this.get('student').id
      }
    }).then(marks => {
      for (var i = 0; i < marks.get('length'); i++) {
        this.get('marks').pushObject(marks.objectAt(i));
      }
      console.log(this.get('marks').get('length'));
    });
  },

  actions: {

  deleteCourse() {
//**** I think the order you delete is important because of dependancies, but idk. Just incase it is though, I've deleted everything in the same order its all added and updated in

//delete secondary school
        this.get('store').findRecord('secondary-school', this.get('hsGrade.course.school').id, { backgroundReload: false }).then(function(school) {
        school.deleteRecord();
        school.get('isDeleted');
        school.save();
      });

       //delete high school subject
        this.get('store').findRecord('hs-subject-schema', this.get('hsGrade.course.subject').id, { backgroundReload: false }).then(function(subject) {
        subject.deleteRecord();
        subject.get('isDeleted');
        subject.save();
      });

       //update course source
this.get('store').findRecord('hs-course-source', this.get('hsGrade.course.source').id, { backgroundReload: false }).then(function(source) {
        source.deleteRecord();
        source.get('isDeleted');
        source.save();
      });

      //update high school course
      this.get('store').findRecord('hs-course', this.get('hsGrade.course.').id, { backgroundReload: false }).then(function(course) {
        course.deleteRecord();
        course.get('isDeleted');
        course.save();
      });

      //update high school grade 
      this.get('store').findRecord('hs-grade-schema', this.get('hsGrade').id, { backgroundReload: false }).then(function(grade) {
        grade.deleteRecord();
        grade.get('isDeleted');
        grade.save();
      });

  },

//this function exicutes when the "update" button is clicked. it just sets the "updateCourse" variable to true, this then will cause the view-highschool modal to show
  updateCourse() {
       this.set('updateCourse', true); 
  },

//this function exicutes when the "view more" button is clicked. it just sets the "showMore" variable to true, this then will cause the view-highschool modal to show
  viewMore() {
    this.set('showMore', true); 
  },
 }
});

