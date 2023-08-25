interface Component<T extends HTMLElement, U extends HTMLElement>
  extends HTMLElement {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;
  connectedCallback(): void;
  addClasses(...classNames: string[]): void;
  addEventListener(event: string, callback: (event: Event) => void): void;
  render(): void;
}

interface PageComponent<T extends HTMLElement, U extends HTMLElement>
  extends Component<T, U> {}
