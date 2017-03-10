import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  statusModel: null,
  loadModel: null,
  planModel: null,
  termCodes: null,
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
      this.set('termToEdit', term.id);
      this.set('isAddingProgram', true);

    },

    addGrade(term){
      this.set('termToEdit', term.id);
      this.set('isAddingGrade', true);

    },

    updateRecord(_model, object){

      object.save();

      if(_model === 'term'){

        this.set('termToEdit', object);
        this.set('programToEdit', null);
        this.set('courseToEdit', null);

      } else if(_model === 'program'){

        this.set('termToEdit', null);
        this.set('programToEdit', object);
        this.set('courseToEdit', null);

      } else if(_model === 'course'){
        var c = this.get('store').peekRecord('course-code', object.id);
        this.set('termToEdit', null);
        this.set('programToEdit', null);
        this.set('courseToEdit', c);

      }
      this.set('isEditing', true);
    },

    deleteRecord(_model, object){
      if(_model === 'term'){
        this.set('terms', this.get('terms').without(object));
      }

      //Deletes the grade as well if it is a course code.  Causes an issue if it is the grade associated with more than
      //one course

      if(_model === 'course-code'){
        this.get('store').findRecord('grade', object.belongsTo('gradeInfo').id(), { backgroundReload: false }).then(function(obj) {
          if(obj.hasMany('courses').ids().length === 1){
            obj.destroyRecord().then(function() {
              console.log("Deleted grade");
            });
          }
        });
      }


      this.get('store').findRecord(_model, object.id, { backgroundReload: false }).then(function(obj) {
        obj.destroyRecord().then(function() {
          console.log("Deleted " + _model);
        });
      });
    },

    deletePlan(program, plan){
      program.get('plan').removeObject(plan);
      program.save();
    },

    showNote(note){
      this.set('descriptionShow', true);
      this.set('description', note);
    },
  }
});
