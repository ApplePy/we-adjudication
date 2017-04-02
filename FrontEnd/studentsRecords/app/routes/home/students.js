import Ember from 'ember';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default Ember.Route.extend(RouteMixin, {

  model(params) {
    // returns a PagedRemoteArray for all-students to use
    params.paramMapping = {page: "page",
                           perPage: "limit",
                           total_pages: "total"};
    return this.findPaged("student", params);
  },

  afterModel(model) {
    // When first navigated to, redirect to first student
    this.transitionTo('home.students.student-entry', model.get('firstObject'));
  },
});
