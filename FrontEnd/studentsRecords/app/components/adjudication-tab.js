import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    termArray: [],
    selectedTerm: false,
    isAdjShow: false,
    buttonDisabled: true,
    studentArray: [],
    termsToAdju: [],

     init() {
       this.set('termArray', []);
       this.set('studentArray', []);
         this._super(...arguments);

         //load all terms for drop down
    this.get('store').query('term-code', {limit: 10}).then((records) => {
    let totalRecords = records.get('meta').total;
    let offsetUsed = records.get('meta').offset;
    let limitUsed = records.get('meta').limit;
    this.get('store').query('term-code', {limit: totalRecords}).then((terms) => {
      for(var i=0; i < terms.get('length'); i++){
        this.get('termArray').pushObject(terms.objectAt(i));
      }
    });
  });

//load all students
  this.get('store').query('student', {limit: 10}).then((records) => {
    let totalRecords = records.get('meta').total;
    let offsetUsed = records.get('meta').offset;
    let limitUsed = records.get('meta').limit;
    this.get('store').query('student', {limit: totalRecords}).then((students) => {
      for(var i=0; i < students.get('length'); i++){
        this.get('studentArray').pushObject(students.objectAt(i));
      }
    });
  });
     },

    didRender() {
    Ember.$('.menu .item').tab();
  },

  actions: {
    selectTerm(term) {
     this.set('termsToAdju', []);
    this.set('selectedTerm', term);
    this.set('buttonDisabled', false);
    this.get('store').query('term', {limit: 10}).then((records) => {
    let totalRecords = records.get('meta').total;
    let offsetUsed = records.get('meta').offset;
    let limitUsed = records.get('meta').limit;
    this.get('store').query('term', {limit: totalRecords, 
          filter: {
           termCode: this.get('selectedTerm'), }
        }).then((term) => {
         for(var i = 0; i< term.get('length'); i++) {
           this.get('termsToAdju').pushObject(term.objectAt(i));
          }
 });
  });
    },

adjudicate() { 
this.set('isAdjShow', true);
}
  }
});
