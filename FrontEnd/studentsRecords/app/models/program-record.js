import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  level: DS.attr('number'),
  load: DS.attr('number'),
  status: DS.attr('string'), // TODO: is this an enumeration?
  termCode: DS.belongsTo('term-code'),
  grades: DS.hasMany('grade'),
  courseCodes: DS.hasMany('course-code'),
  planCodes: DS.hasMany('plan-code')
});
