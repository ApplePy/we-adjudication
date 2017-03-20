import DS from 'ember-data';

export default DS.Model.extend({
  number: DS.attr('number'),
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  DOB: DS.attr('date'),
  photo: DS.attr('string'),
  registrationComments: DS.attr('string'),
  basisOfAdmission: DS.attr('string'),
  admissionAverage: DS.attr('string'),
  admissionComments: DS.attr('string'),
  awards: DS.hasMany('award'),
  advancedStandings: DS.hasMany('advanced-standing'),
  resInfo: DS.belongsTo('residency'),
  genderInfo: DS.belongsTo('gender'),
  hsGrades: DS.hasMany('hs-grade'),
  terms: DS.hasMany('term')

});
