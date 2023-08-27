import * as Model from "./model/model";
import Router from "./router";
import { View } from "./view/view";

class Controller {
  private static instance: Controller | null = null;

  private constructor() {
    this.init();
  }

  static getInstance(): Controller {
    if (Controller.instance === null) {
      Controller.instance = new Controller();
    }
    return Controller.instance;
  }

  init() {
    Model.initAppState();
    window.addEventListener("new-page-create", (event) => {
      const customEvent = event as CustomEvent;
      View.getPageData(this.transferNewPageData(customEvent.detail.page));
    });
    Router.init();
  }

  transferNewPageData(route: string): object {
    // Get the data from the model for the new page.
    const data = Model.getDataForPage(route) as object;

    // send data to view for setting data to new page.
    return data;
  }
}

const controller = Controller.getInstance();
