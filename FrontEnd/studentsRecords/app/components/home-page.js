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
  isManageRulesShowing: false,
  isAdding: false,
  isAboutShowing: false,
  isHighSchoolShowing: false,
  isManageAdjudicationShowing: false,
  isAdjudicationTabShowing: false,

  actions: {
    home () {
      this.set('isHomeShowing', true);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isManageSystemShowing', false);
      this.set('isManageRulesShowing', false);
      this.set('isAboutShowing', false);
      this.set('isAdding', false);
      this.set('isHighSchoolShowing', false);
      this.set('isManageAdjudicationShowing', false);
      this.set('isAdjudicationTabShowing', false);
    },

    studentsDataEntry (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', true);
      this.set('isManageSystemShowing', false);
      this.set('isManageRulesShowing', false);
      this.set('isAboutShowing', false);
      this.set('isAdding', false);
      this.set('isHighSchoolShowing', false);
      this.set('isManageAdjudicationShowing', false);
      this.set('isAdjudicationTabShowing', false);
    },

    manageSystem (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isManageSystemShowing', true);
      this.set('isManageRulesShowing', false);
      this.set('isAboutShowing', false);
      this.set('isAdding', false);
      this.set('isHighSchoolShowing', false);
      this.set('isManageAdjudicationShowing', false);
      this.set('isAdjudicationTabShowing', false);
    },

    manageHighSchoolData (){
      this.set('isHighSchoolShowing', true);
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isManageRulesShowing', false);
      this.set('isManageSystemShowing', false);
      this.set('isAboutShowing', false);
      this.set('isAdding', false);
      this.set('isManageAdjudicationShowing', false);
      this.set('isAdjudicationTabShowing', false);
    },

    addStudent (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isManageSystemShowing', false);
      this.set('isManageRulesShowing', false);
      this.set('isAboutShowing', false);
      this.set('isAdding', true);
      this.set('isHighSchoolShowing', false);
      this.set('isManageAdjudicationShowing', false);
      this.set('isAdjudicationTabShowing', false);
    },

     manageAdjudication (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isManageSystemShowing', false);
      this.set('isManageRulesShowing', false);
      this.set('isAboutShowing', false);
      this.set('isAdding', false);
      this.set('isHighSchoolShowing', false);
      this.set('isManageAdjudicationShowing', true);
      this.set('isAdjudicationTabShowing', false);
    },

    manageRules(){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isManageSystemShowing', false);
      this.set('isManageRulesShowing', true);
      this.set('isAboutShowing', false);
      this.set('isAdding', false);
      this.set('isHighSchoolShowing', false);
      this.set('isManageAdjudicationShowing', false);
      this.set('isAdjudicationTabShowing', false);
    },

    adjudicateTab (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isManageSystemShowing', false);
      this.set('isManageRulesShowing', false);
      this.set('isAboutShowing', false);
      this.set('isAdding', false);
      this.set('isHighSchoolShowing', false);
      this.set('isManageAdjudicationShowing', false);
      this.set('isAdjudicationTabShowing', true);
    },

    about (){
      this.set('isHomeShowing', false);
      this.set('isStudentsRecordsDataEntry', false);
      this.set('isManageSystemShowing', false);
      this.set('isManageRulesShowing', false);
      this.set('isAboutShowing', true);
      this.set('isAdding', false);
      this.set('isHighSchoolShowing', false);
      this.set('isManageAdjudicationShowing', false);
      this.set('isAdjudicationTabShowing', false);
    },
  }
});
