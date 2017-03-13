import DS from 'ember-data';

export default DS.Model.extend({
    code: DS.attr('String'),
    name: DS.attr('String'),
    faculty: DS.belongsTo('faculty'),
    adjudications: DS.hasMany('adjudication'),
    logicalExpressions: DS.hasMany('logical-expression')
});
