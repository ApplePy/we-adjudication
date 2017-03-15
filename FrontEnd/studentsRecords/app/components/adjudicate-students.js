import Ember from 'ember';

export default Ember.Component.extend({
  notDONE: null,
  termCodeID: null,
  isWorking: true,
  isFinished: false,
  hasError: false,
  message: null,

  init() {
    this._super(...arguments);
    this.set('message', "Initializing...");
    //Get all of the rules
    //Get all of the possible assessment codes (May need to sort these into categories??)

    //Start adjudicating!
    this.send('adjudicate');

    /*
    * To help sorting student/term array
    *
    * var songs = [
     {trackNumber: 4, title: 'Ob-La-Di, Ob-La-Da'},
     {trackNumber: 2, title: 'Back in the U.S.S.R.'},
     {trackNumber: 3, title: 'Glass Onion'},
     ];

     console.log(songs.get('firstObject'));  // {trackNumber: 2, title: 'Back in the U.S.S.R.'}
     songs.addObject({trackNumber: 1, title: 'Dear Prudence'});
     songs = songs.sortBy('trackNumber');
     console.log(songs);
    *
    *
    * */

  },

  actions: {
    //Adjudicates the students
    adjudicate() {
      /*
      * WILL WE HAVE TO CALCULATE THE TERM AVERAGE OR IS IT GIVEN????
      * Term Average Calculation: (Will be done before checking assessment codes, for each term)
      * totalUnits = 0;
      * totalUnitsPassed = 0;
      * termTotalMarks = 0;
      * termTotalCourses = 0;
      * For each course in the term...
      *   termTotalCourses++;
      *   totalUnits += totalUnits + course.unit
      *   termTotalMarks += course.grade.mark
      *   if course.grade.mark >= 50
      *     termUnitsPassed += course.unit
      * termAVG = termTotalMarks / termTotalCourses
      *
      *
      *
      * Get all of the terms whose termID matches the one passed into this component
      * Get the adjudication information
      * Sort terms in descending order of term average
      * For Each term...
      *   Delete adjudication information if already exists for this term
      *   Create a new adjudication object for this term
      *   For Each Assessment Code...
      *     input necessary value for each rule
      *     if passes all rules, set this assessment code to the student
      *   If Assessment Code array is still blank, set the note that the student will need to be manually adjudicated
      *     Also, set the modal to warn the user that there are students who will need to be manually adjudicated
      * If no warning needed, set isFinished to true, isWorking to false
      * Else set hasError to true, isWorking to false
      *
      *
      * */

    },

    //Gets rid of the modal
    cancel: function () {
      this.set('notDONE', false);
      Ember.$('.ui.modal').modal('hide');
      Ember.$('.ui.modal').remove();
    },

    done: function(){
      this.set('isFinished', true);
      this.set('isWorking', false);
      this.set('hasError', false);
    },

    error: function(){
      this.set('isFinished', false);
      this.set('isWorking', false);
      this.set('hasError', true);
    },

    working: function(){
      this.set('isFinished', false);
      this.set('isWorking', true);
      this.set('hasError', false);
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
