import DS from 'ember-data';

export default DS.Model.extend({
  mark: DS.attr('string'),
  course: DS.belongsTo('hs-course'),
  recipient: DS.belongsTo('student')
});
