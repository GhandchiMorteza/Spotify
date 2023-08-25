var newCustomElement = document.createElement('custom-component');
var newPageElement = document.createElement('page-component');

export class ComponentClass<T extends HTMLElement, U extends HTMLElement>
  extends HTMLElement
  implements Component<T, U>
{
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;
  // static : document.createElement("my-custom-element");

  constructor(
    templateId: string,
    hostId: string,
    public insertAtStart: boolean = true,
    newElementId?: string
  ) {
    super();
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostId)! as T;
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }
    this.innerHTML = this.element.innerHTML;
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  addClasses(...classNames: string[]) {
    this.element.classList.add(...classNames);
  }

  addEventListener(event: string, callback: (event: Event) => void) {
    this.element.addEventListener(event, callback);
  }

  render() {
    this.hostElement.insertAdjacentElement(
      this.insertAtStart ? 'afterbegin' : 'beforeend',
      newCustomElement
    );
    // this.constructor.tagName
    // this.element = this.hostElement.querySelector('slot') as U;
  }
}

export class PageClass<
  T extends HTMLElement,
  U extends HTMLElement
> extends ComponentClass<T, U> {
  constructor(
    templateId: string,
    hostId: string,
    public insertAtStart: boolean = true,
    newElementId?: string
  ) {
    super(templateId, hostId, insertAtStart, newElementId);
  }
  override render() {
    this.hostElement.insertAdjacentElement(
      this.insertAtStart ? 'afterbegin' : 'beforeend',
      newPageElement
    );
  }
}

customElements.define('custom-component', ComponentClass);
customElements.define('page-component', PageClass);
