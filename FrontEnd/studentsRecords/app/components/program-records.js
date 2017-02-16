import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  studentGrades: null,
  progRecs: null,
  isAdding: false,
  //Get a students' grades
  //Get associated program records

  actions:{
    addRecord(){
        this.set('isAdding', true);
    }
  }
});
