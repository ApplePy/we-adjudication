import DS from 'ember-data';

export default DS.Model.extend({
  number: DS.attr(),
  firstName: DS.attr(),
  lastName: DS.attr(),
  gender: DS.attr('number'),
  DOB: DS.attr('date'),
  photo: DS.attr(),
  registrationComments: DS.attr('string'),
  basisOfAdmission: DS.attr('string'),
  admissionAverage: DS.attr('number'),
  admissionComments: DS.attr('string'),
  resInfo: DS.belongsTo('residency')

});
