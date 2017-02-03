import DS from 'ember-data';

export default DS.Model.extend({
  note: DS.attr('string'),
  recipient: DS.belongsTo('student')
});
