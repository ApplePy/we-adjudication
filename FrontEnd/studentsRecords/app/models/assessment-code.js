import DS from 'ember-data';

export default DS.Model.extend({
    code: DS.attr('String'),
    name: DS.attr('String'), //we are using this as the description of the code
    faculty: DS.belongsTo('faculty'),
    adjudications: DS.hasMany('adjudication'),
    logicalExpressions: DS.hasMany('logical-expression')
}); 
