import DS from 'ember-data';

export default DS.Model.extend({
    booleanExp: DS.attr('String'),
    logicalLink: DS.attr('String'),
    assessmentCode: DS.belongsTo('assessment-code'),
    parentExpression: DS.belongsTo('logical-expression', { inverse: 'logicalExpressions' }),
    logicalExpressions: DS.hasMany('logical-expression', { inverse: 'parentExpression' })
});