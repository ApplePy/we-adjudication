import DS from 'ember-data';

export default DS.Model.extend({
  courseLetter: DS.attr('string'),
  courseNumber: DS.attr('string'),
  name: DS.attr('string'),
  unit: DS.attr('number'),
  termInfo: DS.belongsTo('term'),
  gradeInfo: DS.belongsTo('grade')
});
