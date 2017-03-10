import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  student: null,
  marks: [],
  openModal: false,
  newHS: false,
  newElement: null,
  oldGrade: null,

  //----- OBSERVERS -----//
  addMark: Ember.observer("newElement", function () {
    // When new grade modal exits, add new grade element to list
    Ember.run.once(this, function () {
      let marks = this.get('marks');
      let newEl = this.get('newElement');
      let oldEl = this.get('oldGrade');

      // Check that a new element was set
      if (newEl !== null) {
        // If this wasn't an edit, push it onto the marks array
        if (oldEl === null) {
          marks.pushObject(newEl);
        }

        // Clean up when finished
        this.set('newElement', null);
        this.set('oldGrade', null);
      }
    });
  }),
  updateMarks: Ember.observer("student", function () {
    // When student changes, change mark array contents
    _populateMarks.call(this);
  }),

  init() {
    this._super(...arguments);
    _populateMarks.call(this);
  },

  actions: {
    deleteCourse(hsGrade) {
      //update high school grade
      this.get('marks').removeObject(hsGrade);
      hsGrade.destroyRecord();
    },

    //this function exicutes when a model-opening button is clicked. it just sets the "openModal" variable to true, this then will cause the view-highschool modal to show
    updateModal(model) {
      this.set('oldGrade', model);
      this.set('openModal', true);
    },

    // Open new high school course modal
    addHS() {
      console.log('this was a triumph');
      this.set('newHS', true);
    },
  }
});

let _populateMarks = function () {
  // Populate the marks array with contents
  let populateMarksArray = marks => {
    // The array that the marks will be put into
    let marksArray = this.get('marks');

    marks.forEach(element => {
      // This mess is to replace the promiseProxy relation objects in the element with their full equivalents
      // Otherwise the front end doesn't render correctly
      element.get('course').then(course => {
        course.get('school').then(school => {
          course.get('subject').then(subject => {
            // Manually replace objects with their resolved versions
            course.set('school', school);
            course.set('subject', subject);
            element.set('course', course);
            marksArray.pushObject(element);
          });
        });
      }).catch(err => {
        // On resolve issues, just put the element up without it's data
        console.warn(err);
        marksArray.pushObject(element);
      });
    });
  };

  // Clear all existing marks
  this.get('marks').clear();

  //*********************** POPULATE hsMarks[] **************************************
  //you do this so the student-data-entry.hbs file knows whats up and can use the array to loop
  //this is the same logic as awards and advanced standing so it should work (but of course it hasnt been tested yet)
  this.get('store').query('hs-grade', {
    filter: { recipient: this.get('student').id },
    limit: 50,
    offset: 0
  }).then(marks => {
    // Handle pagination
    if (marks.get('meta').total > 50) {
      this.get('store'.query('hs-grade'), {
        filter: { recipient: this.get('student').id },
        limit: marks.get('meta').total,
        offset: 0
      }).then(populateMarksArray);
    } else {
      populateMarksArray(marks);
    }
  });
};
