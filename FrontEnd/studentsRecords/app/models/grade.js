import DS from 'ember-data';

export default DS.Model.extend({
  mark: DS.attr('string'),
  note: DS.attr('string'),
  courses: DS.hasMany('course-code')
});
