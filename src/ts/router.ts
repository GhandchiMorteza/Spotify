import { PageEnum } from "./config";
import { View } from "./view/view";

const Router = {
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
      Router.go(event.state.route, false);
    });

    // Check the initial URL
    Router.go(location.pathname);
  },

  go: (route: string, addToHistory: boolean = true) => {
    //Render or load the route page element
    const pageElement = View.renderPageElement(route === "/" ? "/home" : route);

    // Update the URL
    if (addToHistory) {
      history.pushState({ route }, "", route);
    }

    // Scroll to the top of the page
    window.scrollX = 0;
    window.scrollY = 0;
  },
};

export default Router;
