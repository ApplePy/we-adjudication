import DS from 'ember-data';

export default DS.Model.extend({
  termCode: DS.belongsTo('term-code'),
  student: DS.belongsTo('student'),
  programRecords: DS.hasMany('program-record'),  // NOTE: In a many-to-many relationship, this WILL store data.
  courses: DS.hasMany('course-code'),
  adjudications: DS.hasMany('adjudication')
});
