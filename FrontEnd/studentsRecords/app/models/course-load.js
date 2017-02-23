import DS from 'ember-data';

export default DS.Model.extend({
  load: DS.attr('string'),
  levels: DS.hasMany('program-record')
});
