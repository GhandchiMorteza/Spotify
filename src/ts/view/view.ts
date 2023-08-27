import { PageClass } from "./classes";
import { PageEnum } from "../config";

class ViewSingleton {
  private static instance: ViewSingleton;

  /**
   * The pages that have been rendered.
   */
  private pages: PageComponent<HTMLElement, HTMLElement>[] = [];
  private currentPageData: object | undefined;

  private constructor(private pagesContainer: HTMLElement) {}

  /**
   * Gets the singleton instance of the ViewSingleton class.
   *
   * @returns The ViewSingleton instance.
   */
  static getInstance(): ViewSingleton {
    if (!ViewSingleton.instance) {
      ViewSingleton.instance = new ViewSingleton(
        document.getElementById("pages-container") as HTMLElement
      );
    }
    return ViewSingleton.instance;
  }

  /**
   * Renders the page element for the specified route.
   *
   * @param route The route of the page to render.
   */
  renderPageElement(route: string): void {
    // Deactivate the previously active page element.
    this.deactivePrePage();

    // Get the page element from the DOM, if it exists.
    let pageElement = document.body.querySelector(
      `[data-page="${route}"]`
    ) as HTMLElement | null;

    // If the page element exists, add the `is-active` class to it.
    if (pageElement) {
      if (!pageElement.classList.contains("is-active")) {
        pageElement.classList.add("is-active");
      }
      return;
    }

    // The page element doesn't exist yet, so we need to create it.
    this.requestPageData(route);
    const newPage = new PageClass(
      route.replace(/\//g, ""),
      this.pagesContainer.id,
      route,
      this.currentPageData as object
    );
    this.pages.push(newPage);
  }

  /**
   * Deactivates the previously active page element.
   */
  deactivePrePage() {
    const prevActivePage = this.pagesContainer.querySelector(".is-active");

    if (prevActivePage) {
      prevActivePage.classList.remove("is-active");
    }
  }

  /**
   * Request new page data by despatching new page event to recieve page data
   */
  requestPageData(route: string) {
    const eventNewPage = new CustomEvent("new-page-create", {
      detail: {
        page: route,
      },
    });

    window.dispatchEvent(eventNewPage);
  }

  /**
   * Getting the data for the page after request
   */
  getPageData(data: object) {
    this.currentPageData = data;
  }
}

export const View = ViewSingleton.getInstance();
