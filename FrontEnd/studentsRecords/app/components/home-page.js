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
  isImportExportShowing: false,
  isAboutShowing: false,


  actions: {
    home () {
      this.set('isHomeShowing', true);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isManageSystemShowing', false);
      this.set('isAboutShowing', false);
      this.set('isImportExportShowing', false);
      this.set('isAdding', false);
    },

    studentsDataEntry (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', true);
      this.set('isManageSystemShowing', false);
      this.set('isAboutShowing', false);
      this.set('isImportExportShowing', false);
      this.set('isAdding', false);
    },

    manageSystem (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isManageSystemShowing', true);
      this.set('isAboutShowing', false);
      this.set('isImportExportShowing', false);
      this.set('isAdding', false);
    },

    addStudent (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isManageSystemShowing', false);
      this.set('isAboutShowing', false);
      this.set('isImportExportShowing', false);
      this.set('isAdding', true);
    },

    importExport (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isManageSystemShowing', false);
      this.set('isAboutShowing', false);
      this.set('isImportExportShowing', true);
      this.set('isAdding', false);
    },

    about (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isManageSystemShowing', false);
      this.set('isAboutShowing', true);
      this.set('isImportExportShowing', false);
      this.set('isAdding', false);
    }
  }
});
