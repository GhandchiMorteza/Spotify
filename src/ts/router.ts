const Router = {
  init: () => {
    // listener for main navigation icons
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

    // Handling different route cases
    switch (route) {
      case '/':
        // ...
        break;
      case '/home':
        // ...
        break;
      case '/search':
        // ...
        break;
      case '/library/albums':
        // ...
        break;
      case '/library/artists':
        // ...
        break;
      case '/library/playlists':
        // ...
        break;
      case '/library/playlists/liked-songs':
        // ...
        break;
      case '/library/playlists/liked-albums':
        // ...
        break;
      default:
        // Handle routes with IDs
        if (route.startsWith('/album/')) {
          const albumId = route.split('/album/')[1];
          // Handle the album page using the albumId
          break;
        } else if (route.startsWith('/player/')) {
          const playerId = route.split('/player/')[1];
          // Handle the player page using the playerId
          break;
        } else if (route.startsWith('/artist/')) {
          const artistId = route.split('/artist/')[1];
          // Handle the artist page using the artistId
          break;
        } else {
          // Handle "URL doesn't exist!"
          break;
        }
    }

    // switch (route) {
    //   case '/':
    //     let template = document.getElementById(
    //       'page-home-template'
    //     ) as HTMLTemplateElement;
    //     let clone = document.importNode(template.content, true);
    //     pageElement = clone.firstElementChild as HTMLElement;
    //     break;
    //   case '/search':
    //     pageElement = document.createElement('h1') as HTMLElement;
    //     pageElement.textContent = 'Hello search!';
    //     break;
    //   case '/library':
    //     pageElement = document.createElement('h1') as HTMLElement;
    //     pageElement.textContent = 'Hello library!';
    //     break;
    //   default:
    //     pageElement = document.createElement('h1') as HTMLElement;
    //     pageElement.textContent = "URL doesn't exist!";
    //     break;
    // }
    // const host = document.getElementById('pages-container');
    // host?.children[0].remove();
    // host?.insertAdjacentElement('afterbegin', pageElement);

    window.scrollX = 0;
    window.scrollY = 0;
  },
};

export default Router;
