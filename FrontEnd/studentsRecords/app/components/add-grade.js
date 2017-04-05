import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  notDONE: null,
  newMark: null,
  newNote: null,
  term: null,
  grades: [],
  courses: null,

  init() {
    this._super(...arguments);

    this.set('courses', []);
    var newCourse = {
      courseLetter: null,
      courseNumber: null,
      name: null,
      unit: null,
    };
    this.get('courses').pushObject(newCourse);

  },

  actions: {

    deleteCourseField(){
      //pop off the last element of the plans array
      this.get('courses').popObject();
    },

    newCourseField(){
      var newCourse = {
        courseLetter: null,
        courseNumber: null,
        name: null,
        unit: null,
      };
      this.get('courses').pushObject(newCourse);

    },

    saveRecord(){
      var grade = this.get('store').createRecord('grade', {
        mark: this.get('newMark'),
        note: this.get('newNote'),
      });

      var t = this.get('store').peekRecord('term', this.get('term'));
      var self = this;

      grade.save().then(function(record){
        for(var i = 0; i < self.get('courses').length; i++) {
          var course = self.get('store').createRecord('course-code', {
            courseLetter: self.get('courses').objectAt(i).courseLetter,
            courseNumber: self.get('courses').objectAt(i).courseNumber,
            name: self.get('courses').objectAt(i).name,
            unit: self.get('courses').objectAt(i).unit,
            termInfo: t,
            gradeInfo: record
          });
          course.save().then(function () {
            console.log('saved course');
          }).catch(function(){
            console.log("course save failed");
          });
        }
      }).catch(function(){
        console.log("grade save failed");
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
