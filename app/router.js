import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('posts', function() {
    this.route('new');
    this.route('edit');
  });
  this.route('review');
  this.route('reviews');
  this.route('reviews\\index');
  this.route('reviews\\new');
  this.route('reviews\\edit');
});

export default Router;
