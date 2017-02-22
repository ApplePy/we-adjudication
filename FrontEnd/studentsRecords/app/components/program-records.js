import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  studentGrades: null,
  progRecs: null,
  isAdding: false,
  isEditing: false,
  termToEdit: null,
  programToEdit: null,
  courseToEdit: null,
  descriptionShow: false,
  description: null,
  //Will need to change this to terms and change the variable on student-data-entry.hbs when the component is set
  terms1: null,
  //Get the terms
  //Get the courses from those terms
  //Get the grades from those courses
  //Get the program records from the terms
  //Get the plan codes from the program records

  actions:{
    addTerm(){
      this.set('isAdding', true);
    },

    addRecord(term){
        console.log(term.name);
    },

    addGrade(term){
      console.log(term.name);
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
  },

  terms: [
    {
      name: "Fall 2015",
      courseInfo: [
        {
          courseLetter: "SE",
          courseNumber: 2500,
          name: "Software eng",
          unit: 0.5,
          grade: {
            mark: 90,
            note: "Great Job"
          }
        },
        {
          courseLetter: "SE",
          courseNumber: 2500,
          name: "Software eng",
          unit: 0.5,
          grade: {
            mark: 90,
            note: null
          }
        },
        {
          courseLetter: "SE",
          courseNumber: 2500,
          name: "Software eng",
          unit: 0.5,
          grade: {
            mark: 90,
            note: null
          }
        }
      ],
      program:[
        {
          name: "Program",
          level: 1,
          load: "F",
          status: "Active in Program",
          plan: [
            {
              name: "Software Engineering"
            },
            {
              name: "Mechatronics Engineering"
            }
          ]
        }
      ]
    },
    {
      name: "Spring 2016",
      courseInfo: [
        {
          courseLetter: "SE",
          courseNumber: 2500,
          name: "Software eng",
          unit: 0.5,
          grade: {
            mark: 90,
            note: null
          }
        },
        {
          courseLetter: "SE",
          courseNumber: 2500,
          name: "Software eng",
          unit: 0.5,
          grade: {
            mark: 90,
            note: "Yas2"
          }
        },
        {
          courseLetter: "SE",
          courseNumber: 2500,
          name: "Software eng",
          unit: 0.5,
          grade: {
            mark: 90,
            note: "Yas3"
          }
        },
        {
          courseLetter: "SE",
          courseNumber: 2500,
          name: "Software eng",
          unit: 0.5,
          grade: {
            mark: 90,
            note: "Yas4"
          }
        }
      ],
      program:[
        {
          name: "Program",
          level: 1,
          load: "F",
          status: "Active in Program",
          plan: [
            {
              name: "Software Engineering"
            },
            {
              name: "Mechatronics Engineering"
            }
          ]
        }
      ]
    },
    {
      name: "Summer 2016",
      courseInfo: [

      ]
    },
    {
      name: "Fall 2016",
      courseInfo: [
        {
          courseLetter: "SE",
          courseNumber: 2500,
          name: "Software eng",
          unit: 0.5,
          grade: {
            mark: 90,
            note: "Yas5"
          }
        },
        {
          courseLetter: "SE",
          courseNumber: 2500,
          name: "Software eng",
          unit: 0.5,
          grade: {
            mark: 90,
            note: "Yas6"
          }
        }
      ],
      program:[
        {
          name: "Program",
          level: 1,
          load: "F",
          status: "Active in Program",
          plan: [
          ]
        },
        {
          name: "Program",
          level: 1,
          load: "F",
          status: "Active in Program",
          plan: [
            {
              name: "Bio year 2"
            }
          ]
        }
      ]
    },
    {
      name: "Spring 2017",
      courseInfo: [
        {
          courseLetter: "ES",
          courseNumber: 1050,
          name: "Design",
          unit: 2,
          grade: {
            mark: 90,
            note: ""
          }
        },
        {
          courseLetter: "SE",
          courseNumber: 2500,
          name: "Software eng",
          unit: 0.5,
          grade: {
            mark: 90,
            note: "Yas"
          }
        }
      ],
      program:[
        {
          name: "Program",
          level: 3,
          load: "P",
          status: "Active in Program",
          plan: [
            {
              name: "Software Engineering"
            }
          ]
        }
      ]
    }
  ],
});
