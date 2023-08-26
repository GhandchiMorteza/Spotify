export class ComponentClass<T extends HTMLElement, U extends HTMLElement>
  implements Component<T, U>
{
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostId: string,
    public insertAtStart: boolean = true,
    newElementId?: string
  ) {
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
      this.element
    );
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
}
