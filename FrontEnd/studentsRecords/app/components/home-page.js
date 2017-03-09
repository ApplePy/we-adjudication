import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement() {
//    Ember.$('.tabular.menu .item').tab();
    Ember.$(document).ready(function(){
      Ember.$('.ui .item').on('click', function() {
        Ember.$('.ui .item').removeClass('active');
        Ember.$(this).addClass('active');
      });
    });
  },

  isHomeShowing: true,
  isStudentsRecordsDataEntry: false,
  isManageSystemShowing: false,
  isAdding: false,
  isAboutShowing: false,
  isHighSchoolShowing: false,


  actions: {
    home () {
      this.set('isHomeShowing', true);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isManageSystemShowing', false);
      this.set('isAboutShowing', false);
      this.set('isAdding', false);
      this.set('isHighSchoolShowing', false);
    },

    studentsDataEntry (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', true);
      this.set('isManageSystemShowing', false);
      this.set('isAboutShowing', false);
      this.set('isAdding', false);
      this.set('isHighSchoolShowing', false);
    },

    manageSystem (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isManageSystemShowing', true);
      this.set('isAboutShowing', false);
      this.set('isAdding', false);
      this.set('isHighSchoolShowing', false);
    },

    manageHighSchoolData (){
      this.set('isHighSchoolShowing', true);
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isManageSystemShowing', false);
      this.set('isAboutShowing', false);
      this.set('isAdding', false);
    },

    addStudent (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isManageSystemShowing', false);
      this.set('isAboutShowing', false);
      this.set('isAdding', true);
      this.set('isHighSchoolShowing', false);
    },

    about (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isManageSystemShowing', false);
      this.set('isAboutShowing', true);
      this.set('isAdding', false);
      this.set('isHighSchoolShowing', false);
    }
  }
});
