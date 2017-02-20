import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement() {
    Ember.$(document).ready(function(){
      Ember.$('.ui .title').on('click', function() {
        Ember.$('.ui .title').removeClass('active');
        Ember.$('.ui .content').removeClass('active');
        Ember.$(this).addClass('active');
        Ember.$(this > '.content').addClass('active');
        Ember.$(this).children().addClass('active');
      });
    });
  },
  store: Ember.inject.service(),
  studentGrades: null,
  progRecs: null,
  isAdding: false,
  descriptionShow: false,
  description: null,
  //Get the terms
  //Get the courses from those terms
  //Get the grades from those courses
  //Get the program records from the terms
  //Get the plan codes from the program records

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
      program:[]
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

  actions:{
    addRecord(){
        this.set('isAdding', true);
    },

    showNote(note){
      this.set('descriptionShow', true);
      this.set('description', note);
    }
  }
});
