interface Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;
  addClasses(...classNames: string[]): void;
  addEventListener(event: string, callback: (event: Event) => void): void;
  render(): void;
}

interface PageComponent<T extends HTMLElement, U extends HTMLElement>
  extends Component<T, U> {}

interface itemComponent<T extends HTMLElement, U extends HTMLElement>
  extends Component<T, U> {}

interface ContainerComponent<T extends HTMLElement, U extends HTMLElement>
  extends Component<T, U> {}
