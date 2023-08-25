import * as model from './model/model';
import Router from './router';
import albumView from './view/albumView';

window.addEventListener('DOMContentLoaded', async () => {
  Router.init();
  model.initAppState();
});
