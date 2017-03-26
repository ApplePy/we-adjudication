import DS from 'ember-data';

export default DS.Model.extend({
  course: DS.attr('string'),
  description: DS.attr('string'),
  units: DS.attr('number'),
  grade: DS.attr('string'),
  from: DS.attr('string'),
  recipient: DS.belongsTo('student')
});
