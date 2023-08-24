import * as model from './model/model';
import Router from './router';
import albumView from './views/albumView';

window.addEventListener('DOMContentLoaded', async () => {
  Router.init();
  model.initAppState();
});
