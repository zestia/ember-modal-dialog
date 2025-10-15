import Application from '@ember/application';
import Resolver from 'ember-resolver';
import config from './config.js';
import * as Router from './router.js';
import * as ApplicationTemplate from './templates/application.gjs';
import * as ExampleModalComponent from './components/example-modal.gjs';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  Resolver = Resolver.withModules({
    'demo/router': Router,
    'demo/templates/application': ApplicationTemplate,
    'demo/components/example-modal': ExampleModalComponent
  });
}
