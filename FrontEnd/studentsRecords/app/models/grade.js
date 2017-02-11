import DS from 'ember-data';

export default DS.Model.extend({
  mark: DS.attr('number'),
  note: DS.attr('string'),
  programRecord: DS.belongsTo('program-record'),
  student: DS.belongsTo('student')
});
