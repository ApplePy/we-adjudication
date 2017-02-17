import Ember from 'ember';

export default Ember.Component.extend({
    //hsCourse: null,
    //courseSource: null,
    hsGrade: null,
    //secondarySchool: null,
    //hsSubject: null,
    editCourse: null,
    selectedSourceID: null,
    courseSourceModel: null,
    store: Ember.inject.service(), //idk if we need this or not

//hasmany relationship -> dont set it, mongo does it
//belongsto relationship -> must set

    actions: {
      //theoretically, init() should load up the courseSourceModel with all the hs-course-source info so all options can be displayed in the drop down
      //idk if this is right because i cant test it but ive taken it from student-data-entry.js with the residencys and modified it 
    init() {
      var self = this;
    // load course sources data model
    this.get('store').findAll('hs-course-source').then(function (records) {
      self.set('courseSourceModel', records);
    });

     this.set('selectedSourceID', this.get('hsGrade').get('source').get('id'));

},

//this is what should happen when the "code" drop down is changed (like when a new option is selected)
//once again... idk if this is right because i cant test it but ive taken it from student-data-entry.js with the residencys and modified it 
selectCode (code){
      this.set('selectedSourceID', code);
      //Set the value of this student's residency to this one
      var sourceCode = this.get('store').peekRecord('hs-course-source', this.get('selectedSourceID'));
      this.get('hsGrade.course').set('source', sourceCode);
    },

    saveCourse() {

      // **** the order you update the models in is important! 
      //basically update/delete/add the models with dependancies last, and update/delete/add what theyre dependant on first

      //update secondary school first
        this.get('store').findRecord('secondary-school', this.get('hsGrade.course.school').id).then((secondarySchool) => {
        secondarySchool.set('name', this.get('hsGrade.course.school.name'));
        secondarySchool.save();
      });

      //update high school subject
        this.get('store').findRecord('hs-subject-schema', this.get('hsGrade.course.subject').id).then((subject) => {
        subject.set('name', this.get('hsGrade.course.subject.name'));
        subject.set('description', this.get('hsGrade.course.subject.description'));
        subject.save();
      });

      //update course source
this.get('store').findRecord('hs-course-source', this.get('hsGrade.course.source').id).then((code) => {
        code.set('code', this.get('hsGrade.course.source.code'));
        code.save();
      });

      //update high school course
      this.get('store').findRecord('hs-course', this.get('hsGrade.course').id).then((course) => {
        course.set('level', this.get('hsGrade.course.level'));
        course.set('unit', this.get('hsGrade.course.unit'));
        course.set('source', this.get('hsGrade.course.source'));
        course.set('school', this.get('hsGrade.course.school'));
        course.set('subject', this.get('hsGrade.course.subject'));
        course.save();
      });

      //update high school grade 
      this.get('store').findRecord('hs-grade-schema', this.get('hsGrade').id).then((grade) => {
        grade.set('mark', this.get('hsGrade.mark'));
        grade.set('course', this.get('hsCourse'));
        //I havent set the recipient because you dont need to, idk if mongo will like this or not
        grade.save();
      });

//this stuff just closes the modal when its done updating
    this.set('notDONE', false);
     Ember.$('.ui.modal').modal('hide');
     Ember.$('.ui.modal').remove();
  },
        
   close: function() {
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
