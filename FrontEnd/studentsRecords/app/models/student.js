import DS from 'ember-data';

export default DS.Model.extend({
  number: DS.attr(),
  firstName: DS.attr(),
  lastName: DS.attr(),
  DOB: DS.attr('date'),
  photo: DS.attr(),
  resInfo: DS.belongsTo('residency'),
  genderInfo: DS.belongsTo('gender')

});
