import DS from 'ember-data';

export default DS.Model.extend({
  courseLetter: DS.attr('string'),
  courseNumber: DS.attr('number'),
  name: DS.attr('string'),
  unit: DS.attr('number'),
  termInfo: DS.belongsTo('term-code'),
  gradeInfo: DS.belongsTo('grade')
});
