import Ember from 'ember';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default Ember.Route.extend(RouteMixin, {

  // NOTE: Model is automatically injected into the controller by the default hook
  model(params) {
    // returns a PagedRemoteArray for students-list to use
    params.paramMapping = {page: "page",
                           perPage: "limit",
                           total_pages: "total"};
    return this.findPaged("student", params);
  },

  redirect(model) {
    // When first navigated to, redirect to first student
    if (model.get('length') >= 1) {
      this.transitionTo('home.students.student-entry', model.get('firstObject'));
    }
  },
});
