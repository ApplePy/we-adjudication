import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('home', {path: '/'}, function() {
    this.route('welcome', {path: '/'});
    this.route('students');
    this.route('manage-system');
    this.route('import');
    this.route('about');
    this.route('add-student');
    this.route('manage-adjudication-codes');
    this.route('manage-high-school');
    this.route('manage-adjudication-rules');
  });
});

export default Router;
