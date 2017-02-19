import DS from 'ember-data';

export default DS.Model.extend({
  number: DS.attr(),
  firstName: DS.attr(),
  lastName: DS.attr(),
  DOB: DS.attr('date'),
  photo: DS.attr(),
  registrationComments: DS.attr('string'),
  basisOfAdmission: DS.attr('string'),
  admissionAverage: DS.attr('string'),
  admissionComments: DS.attr('string'),
  awards: DS.hasMany('award'),
  advancedStandings: DS.hasMany('advanced-standing'),
  resInfo: DS.belongsTo('residency'),
  genderInfo: DS.belongsTo('gender'),
  hsGrades: DS.hasMany('hs-grade'),
  terms: DS.hasMany('term-code')

});
