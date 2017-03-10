import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  level: DS.attr('number'),
  load: DS.belongsTo('course-load'),
  status: DS.belongsTo('program-status'),
  semester: DS.hasMany('term'),
  plan: DS.hasMany('plan-code')
});
