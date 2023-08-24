//main-nav__navlink
const Router = {
  init: () => {
    const navLinks = document.querySelectorAll(
      'a.main-nav__navlink'
    ) as NodeListOf<HTMLAnchorElement>;
    navLinks.forEach((a) => {
      a.addEventListener('click', (event) => {
        event.preventDefault();
        const url = a.getAttribute('href');
        if (url) {
          Router.go(url);
        }
      });
    });
    // Event Handler for URL changes
    window.addEventListener('popstate', (event) => {
      Router.go(event.state.route, false);
    });
    // Check the initial URL
    Router.go(location.pathname);
  },
  go: (route: string, addToHistory: boolean = true) => {
    console.log(`Going to ${route}`);

    if (addToHistory) {
      history.pushState({ route }, '', route);
    }

    let pageElement: HTMLElement;
    // Make the Router reusable by receiving a collection of path as a regex and component to render
    switch (route) {
      case '/':
        let template = document.getElementById(
          'page-home-template'
        ) as HTMLTemplateElement;
        let clone = document.importNode(template.content, true);
        pageElement = clone.firstElementChild as HTMLElement;
        break;
      case '/search':
        pageElement = document.createElement('h1') as HTMLElement;
        pageElement.textContent = 'Hello search!';
        break;
      case '/library':
        pageElement = document.createElement('h1') as HTMLElement;
        pageElement.textContent = 'Hello library!';
        break;
      default:
        pageElement = document.createElement('h1') as HTMLElement;
        pageElement.textContent = "URL doesn't exist!";
        break;
    }
    const host = document.getElementById('pages-container');
    host?.children[0].remove();
    host?.insertAdjacentElement('afterbegin', pageElement);
    window.scrollX = 0;
    window.scrollY = 0;
  },
};

export default Router;
