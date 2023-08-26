import { PageClass } from './classes';
import { PageEnum } from '../config';

class ViewSingleton {
  private static instance: ViewSingleton;
  private pages: PageComponent<HTMLElement, HTMLElement>[] = [];

  private constructor(private pagesContainer: HTMLElement) {}

  static getInstance(): ViewSingleton {
    if (!ViewSingleton.instance) {
      ViewSingleton.instance = new ViewSingleton(
        document.getElementById('pages-container') as HTMLElement
      );
    }
    return ViewSingleton.instance;
  }

  renderPageElement(route: string): void {
    this.deactivePrePage();

    let pageElement = document.body.querySelector(
      `[data-page="${route}"]`
    ) as HTMLElement | null;

    // The page exist
    if (pageElement) {
      if (!pageElement.classList.contains('is-active')) {
        pageElement.classList.add('is-active');
      }
      return;
    }

    // The page doesn't exist yet, so we need to create it
    this.pages.push(
      new PageClass(route.replace(/\//g, ''), this.pagesContainer.id, route)
    );
  }

  deactivePrePage() {
    const prevActivePage = this.pagesContainer.querySelector('.is-active');

    if (prevActivePage) {
      prevActivePage.classList.remove('is-active');
    }
  }
}

export const View = ViewSingleton.getInstance();
