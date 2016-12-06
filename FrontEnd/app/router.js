import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('help');
  this.route('all');
  this.route('find');
  this.route('main-page');
});

export default Router;
