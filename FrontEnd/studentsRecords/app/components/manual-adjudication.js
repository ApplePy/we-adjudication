import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    student: null, 
    currentTerm: null,
    adjudication: null,
    codesArray: null,
    selectedCode: null,
    selectedDate: null,

init() {
    this._super(...arguments);
//wouldnt this cause adjudication to be queried after the page loads????
    this.get('store').query('adjudication', {limit: 10}).then((records) => {
    let totalRecords = records.get('meta').total;
    let offsetUsed = records.get('meta').offset;
    let limitUsed = records.get('meta').limit;
    this.get('store').query('adjudication', {limit: totalRecords,
    filter: {
        term: this.get('currentTerm').get('id') }   
    }).then((adju) => {
      this.set('adjudication', adju.get('firstObject'));
     this.set('selectedDate', adju.get('firstObject').get('date').toISOString().substring(0, 10));
    });
  });
  },

  actions: {

      save() {
          var self = this;
          this.get('store').findRecord('adjudication', this.get('adjudication').get('id')).then(function(adju) {
              adju.set('date', new Date(self.get('selectedDate')));
              adju.set('termAVG', self.get('adjudication').get('termAVG'));
              adju.set('termUnitsPassed', self.get('adjudication').get('termUnitsPassed'));
              adju.set('termUnitsTotal', self.get('adjudication').get('termUnitsTotal'));
              let code = self.get('store').peekRecord('assessment-code', self.get('selectedCode'));
              adju.set('assessmentCode', code);
              adju.save();
          });

        //   updatedStudent.set('DOB', new Date(this.get('selectedDate')));
      },

      selectCode(code) {
this.set('selectedCode', code);
      },

  }
});
