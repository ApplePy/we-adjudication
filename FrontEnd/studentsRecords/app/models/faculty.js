import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('String'),
    assessmentCodes: DS.hasMany('assessment-code'),
    departments: DS.hasMany('department')
});
