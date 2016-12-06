import DS from 'ember-data';

export default DS.Model.extend({
  studentNo: DS.attr(),
  firstName: DS.attr(),
  lastName: DS.attr(),
  dob: DS.attr(),
  residency: DS.attr(),
  gender: DS.attr(),
  fullName: Ember.computed('firstName', 'lastName', function() {
    return `${this.get('firstName')} ${this.get('lastName')}`;
  })
});
