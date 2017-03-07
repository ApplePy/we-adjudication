import DS from 'ember-data';

export default DS.Model.extend({
  termCode: DS.belongsTo('term-code'),
  student: DS.belongsTo('student'),
  programRecords: DS.hasMany('program-record'),
  courses: DS.hasMany('course-code')
});
