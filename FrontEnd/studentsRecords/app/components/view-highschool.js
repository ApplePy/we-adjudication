import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  newschool: null,
  newsubject: null,
  newcourse: null,
  newmark: null,
  newrecipient: null,
  newGrade: null,
  oldGrade: null,
  notDONE: null,
  systemLists: {
    "secondary-school": [],
    "hs-subject": [],
    "hs-course": []
  },

  //----- OBSERVERS -----//
  // Populate the courses for a given school (and subject maybe)
  populateCoursesSchool: Ember.observer('newschool', function () {
    repopulateCourses.call(this);
  }),

  populateCoursesSubject: Ember.observer('newsubject', function () {
    repopulateCourses.call(this);
  }),

  // Enable save button when a mark has been given
  enableSave: Ember.observer('newmark', function () {
    if (this.get('newmark') !== null && !isNaN(parseInt(this.get('newmark'))) && this.get('newcourse') !== null) {
      console.log('for the good of all of us');
      Ember.$('#savebutton').prop('disabled', false);
    } else {
      Ember.$('#savebutton').prop('disabled', true);
    }
  }),


  //----- INITIALIZERS -----//

  init() {
    this._super(...arguments);

    // Get all the records necessary for the dropdown
    let getAll = emberName => {
      // Get the records
      this.get('store')
        .query(emberName, { limit: 10, offset: 0 })
        .then(records => {

          // If the result was paginated, get all results
          if (typeof records.get("meta").total !== "undefined" && records.get('meta').limit < records.get('meta').total) {
            this.get('store')
              .query(emberName, { limit: records.get("meta").total })
              .then(() => {
                Ember.set(this.get('systemLists'), emberName, this.get('store').peekAll(emberName))
              });
          }
          else {
            Ember.set(this.get('systemLists'), emberName, this.get('store').peekAll(emberName));
          }
        });
    };

    // Populate the Secondary School course source, and subject list
    getAll("secondary-school");
    getAll("hs-subject");
    getAll("hs-course-source");

    // Populate the variables from oldGrade if passed in
    let oldGradeObj = this.get('oldGrade');
    if (oldGradeObj !== null) {
      oldGradeObj.get('course').then(course => {
        this.set('newcourse', course);
        this.set('newmark', this.get('oldGrade.mark'));

        course.get('school').then(school => {
          this.set('newschool', school);
        });
      });

      oldGradeObj.get('recipient').then(recipient => {
        this.set('newrecipient', recipient);
      });
    }
  },

  //hasmany relationship -> dont set it, mongo does it
  //belongsto relationship -> must set

  actions: {
    saveDropdownVal(target, emberName, event) {
      // Get value of dropdown
      let value = event.target.value;

      // Find this record
      this.get('store').findRecord(emberName, value).then((record) => {
        // Update the variable with the results
        this.set(target, record);
      });
    },
    saveHS() {
      console.log("except the ones who are dead");

      //high school grade must be created
      let hsGrade = null;
      let gradeContents = {
          mark: this.get('newmark'),
          course: this.get('newcourse'),
          recipient: this.get('newrecipient')
        };
      if (this.get('oldGrade') === null) {
        // New element, create and save
        hsGrade = this.get('store').createRecord('hs-grade', gradeContents);
        hsGrade.save();

        // Send the new item to parent
      this.set('newGrade', hsGrade);
      } else {
        // Changing existing element, update the old element and save
        hsGrade = this.get('oldGrade');
        for (let key of Object.keys(gradeContents)) {
          hsGrade.set(key, gradeContents[key]);
        }
        hsGrade.save();

        this.set('oldGrade', null);
      }

      //this stuff just closes the modal when its done saving
      this.set('notDONE', false);
      Ember.$('.ui.modal').modal('hide');
      Ember.$('.ui.modal').remove();
    },

    close: function () {
      this.set('notDONE', false);
      Ember.$('.ui.modal').modal('hide');
      Ember.$('.ui.modal').remove();
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

let repopulateCourses = function() {
  console.log("it's hard to overstate");

    let applyCourses = records => {
      console.log('we do what we must');
      // Clear courses
      let courseArray = this.get('systemLists')['hs-course'];
      courseArray.clear();

      // Apply new courses
      records.forEach(element => courseArray.pushObject(element));
      console.log('because we can');
    };

    // Create filter
    let filterObj = { school: this.get('newschool').id };

    // Add subject to filter if selected
    if (this.get('newsubject') !== null) {
      filterObj.subject = this.get('newsubject').id;
    }

    console.log("my satisfaction");

    // Get relevant subjects
    this.get('store').query('hs-course', {
      filter: filterObj,
      limit: 10,
      offset: 0
    }).then(records => {
      console.log("Apterture Science");

      // If paginated, check to make sure all records were recieved
      if (typeof records.get('meta').total !== 'undefined' && records.get('meta').total > records.get('meta').limit) {
        // Missing records, get all
        this.get('store').query('hs-course', {
          filter: filterObj,
          limit: records.get('meta').total,
          offset: 0
        }).then(applyCourses);
      }

      // Not missing records, put onto the system list
      applyCourses(records);
    });
}
