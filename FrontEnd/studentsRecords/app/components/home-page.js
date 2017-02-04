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
  isAdding: false,
  isAboutShowing: false,

  actions: {
    home () {
      this.set('isHomeShowing', true);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isAboutShowing', false);
      this.set('isAdding', false);
    },

    studentsDataEntry (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', true);
      this.set('isAboutShowing', false);
      this.set('isAdding', false);
    },

    addStudent (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isAboutShowing', false);
      this.set('isAdding', true);
    },
    about (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isAboutShowing', true);
      this.set('isAdding', false);
    }
  }
});
