import DS from 'ember-data';

export default DS.Model.extend({
    date: DS.attr('date'),
    termAVG: DS.attr('number'),
    termUnitsPassed: DS.attr('number'),
    termUnitsTotal: DS.attr('number'),
    term: DS.belongsTo('term'),
    assessmentCode: DS.belongsTo('assessment-code')
});
