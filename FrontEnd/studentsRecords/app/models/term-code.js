import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  student: DS.belongsTo('student'),
  programRecords: DS.hasMany('program-record'),
  courses: DS.hasMany('course-code')
});
