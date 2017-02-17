import Ember from 'ember';

export default Ember.Component.extend({
    newsubject: null,  
    newunit: null,
    newdescription: null,
    newmark: null,
    newfrom: null,
    newrecipient: null,
    newschool: null,
    newsource: null,
    store: Ember.inject.service(),
  studentsModel: null,
  INDEX: null,
  //studentID: null,
  notDONE: null,
  //student: null,

//hasmany relationship -> dont set it, mongo does it
//belongsto relationship -> must set

 actions: {
  saveHS() {

//***** the order you add records in is important because of the dependancies
 //basically update/delete/add the models with dependancies last, and update/delete/add what theyre dependant on first

    //must create secondary school record, high school subject record, and course source first, second, and third
    var secondarySchool = this.get('store').createRecord('secondary-school', {
     name: this.get('newschool')
      });
      hsSource.save();

      var hsSubject = this.get('store').createRecord('hs-subject-schema', {
     name: this.get('newsubject'),
     description: this.get('newdescription')
      });
      hsSubject.save();

      var hsSource = this.get('store').createRecord('hs-course-source', {
     code: this.get('newsource'),
      });
      hsSource.save();

//high school courses must be created third
       var hsCourse = this.get('store').createRecord('hs-course', {
      level: this.get('newlevel'),
      unit: this.get('newunit'),
     source: hsSource,
     school: secondarySchool,
     subject: hsSubject
      });
      hsCourse.save();

//high school grade must be created last
    var hsGrade = this.get('store').createRecord('hs-grade-schema', {
      mark: this.get('newmark'),
      course: this.get('newsubject'),
     recipient: this.get('newrecipient')
      });
      hsGrade.save();

//this stuff just closes the modal when its done saving
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

