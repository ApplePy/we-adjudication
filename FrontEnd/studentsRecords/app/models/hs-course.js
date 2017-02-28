import DS from 'ember-data';

export default DS.Model.extend({
  level: DS.attr('number'),
  unit: DS.attr('number'),
  source: DS.belongsTo('hs-course-source'),
  school: DS.belongsTo('secondary-school'),
  subject: DS.belongsTo('hs-subject'),
  hsGrades: DS.hasMany('hs-grade')
});
