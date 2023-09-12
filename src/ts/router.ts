import { PageEnum } from "./config";
import { View } from "./view/view";

const Router = {
  historyStack: Array<PageState>(),
  init: () => {
    // listener for main navigation icons
    const navLinks = document.querySelectorAll(
      "a.main-nav__navlink"
    ) as NodeListOf<HTMLAnchorElement>;

    navLinks.forEach((a) => {
      a.addEventListener("click", (event) => {
        event.preventDefault();
        const url = a.getAttribute("href");
        if (url) {
          Router.go(url);
        }
      });
    });

    // Event Handler for URL changes
    window.addEventListener("popstate", (event) => {
      // Check if the current route is a player page
      const currentRoute = event.state.route;
      if (currentRoute && !currentRoute.startsWith("/player")) {
        Router.go(event.state.route, false);
      }
    });

    // Check the initial URL
    Router.go(location.pathname);
  },

  go: (route: string, addToHistory: boolean = true) => {
    Router.acvtivateNav(route);

    //Render or load the route page element
    const pageElement = View.renderPageElement(route === "/" ? "/home" : route);

    // Update the URL
    if (addToHistory) {
      Router.historyStack.push({ route });

      history.pushState({ route }, "", route);
    }

    // Scroll to the top of the page
    window.scrollX = 0;
    window.scrollY = 0;
  },

  // Go to the previous page that is not a player page
  GoPreviousNonPlayerPage: (): void => {
    let index = Router.historyStack.length - 2;
    while (index >= 0) {
      const state = Router.historyStack[index];

      if (
        state &&
        typeof state.route === "string" &&
        !state.route.startsWith("/player")
      ) {
        Router.go(state.route, true);
        Router.historyStack.splice(-2);
        return;
      }
      index--;
    }
    Router.go(PageEnum.home, true);
    Router.historyStack.splice(-2);
  },
  acvtivateNav: (route: string): void => {
    switch (true) {
      case route === "/":
      case route.includes(PageEnum.home):
        (document.getElementById("home-link") as HTMLElement).style.stroke =
          "#fff";
        (document.getElementById("search-link") as HTMLElement).style.stroke =
          "none";
        (document.getElementById("library-link") as HTMLElement).style.stroke =
          "none";
        break;
      case route.includes(PageEnum.library):
        (document.getElementById("library-link") as HTMLElement).style.stroke =
          "#fff";
        (document.getElementById("search-link") as HTMLElement).style.stroke =
          "none";
        (document.getElementById("home-link") as HTMLElement).style.stroke =
          "none";
        break;
      case route.includes(PageEnum.search):
        (document.getElementById("search-link") as HTMLElement).style.stroke =
          "#fff";
        (document.getElementById("library-link") as HTMLElement).style.stroke =
          "none";
        (document.getElementById("home-link") as HTMLElement).style.stroke =
          "none";
        break;
    }
  },
};

export default Router;

interface PageState {
  route: string;
}
