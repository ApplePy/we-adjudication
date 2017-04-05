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
    this.get('store').query('adjudication', {limit: 10}).then((records) => {
    let totalRecords = records.get('meta').total;
    let offsetUsed = records.get('meta').offset;
    let limitUsed = records.get('meta').limit;
    this.get('store').query('adjudication', {limit: totalRecords,
    filter: {
        term: this.get('currentTerm').get('id') }   
    }).then((adju) => {
      this.set('adjudication', adju.get('firstObject'));
     var date = adju.get('firstObject').get('date');
    var datestring = date.toISOString().substring(0, 10);
    this.set('selectedDate', datestring);
     this.set('selectedCode', adju.get('firstObject').get('assessmentCode').get('id'));
    });
  });
  },

  actions: {

      save() {
          console.log("code: " + this.get('selectedCode'));
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
      },

      selectCode(code) {
this.set('selectedCode', code);
      },

  }
});
