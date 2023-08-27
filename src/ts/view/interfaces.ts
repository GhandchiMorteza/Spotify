interface Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  /**
   * Adds one or more classes to the component's element.
   * @param classNames The classes to add.
   */
  addClasses(...classNames: string[]): void;

  /**
   * Adds an event listener to the component's element.
   * @param event The event name.
   * @param callback The callback function.
   */
  addEventListener(event: string, callback: (event: Event) => void): void;

  /**
   * Renders the component's element.
   */
  render(): void;
}

interface PageComponent<T extends HTMLElement, U extends HTMLElement>
  extends Component<T, U> {}

interface ItemComponent<T extends HTMLElement, U extends HTMLElement>
  extends Component<T, U> {
  id: string;
}

interface ContainerComponent<T extends HTMLElement, U extends HTMLElement>
  extends Component<T, U> {
  /**
   * The item components of the container.
   */
  items: ItemComponent<U, HTMLElement>[];
  addItem(item: ItemComponent<U, HTMLElement>): void;
  removeItem(id: string): void;
  /**
   * Filters the items in the container by the specified filter function.
   *
   * @param filter The filter function to use.
   * @returns void
   */
  filterItems(filter: (item: ItemComponent<U, HTMLElement>) => boolean): void;
}
