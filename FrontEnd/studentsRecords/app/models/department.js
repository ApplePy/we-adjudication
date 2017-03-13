import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('String'),
    faculty: DS.belongsTo('faculty'),
    administrators: DS.hasMany('program-administration')
});
