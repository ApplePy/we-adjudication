import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  studentGrades: null,
  progRecs: null,
  isAddingProgram: false,
  isAddingTerm: false,
  isAddingGrade: false,
  isEditing: false,
  termToEdit: null,
  programToEdit: null,
  courseToEdit: null,
  descriptionShow: false,
  description: null,
  terms: null,
  student: null,

  actions:{
    addTerm(){
      this.set('isAddingTerm', true);
    },

    addRecord(term){
      this.set('isAddingProgram', true);

    },

    addGrade(term){
      this.set('isAddingGrade', true);

    },

    updateRecord(_model, object){

      if(_model === 'term'){

        this.set('termToEdit', object);
        this.set('programToEdit', null);
        this.set('courseToEdit', null);

      } else if(_model === 'program'){

        this.set('termToEdit', null);
        this.set('programToEdit', object);
        this.set('courseToEdit', null);

      } else if(_model === 'course'){

        this.set('termToEdit', null);
        this.set('programToEdit', null);
        this.set('courseToEdit', object);

      }
      this.set('isEditing', true);
    },

    deleteRecord(_model, object){
      /*
      this.get('store').findRecord(_model, object, { backgroundReload: false }).then(function(obj) {
        obj.destroyRecord().then(function() {
          console.log("Deleted " + emberName);
        });
      });
      */
    },

    showNote(note){
      this.set('descriptionShow', true);
      this.set('description', note);
    },
  }
});
