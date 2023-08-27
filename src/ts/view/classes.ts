export abstract class ComponentClass<
  T extends HTMLElement,
  U extends HTMLElement
> implements Component<T, U>
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
    // Get template and make deep copy to place in the host
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
      this.insertAtStart ? "afterbegin" : "beforeend",
      this.element
    );
  }
}

export class PageClass<
  T extends HTMLElement,
  U extends HTMLElement
> extends ComponentClass<T, U> {
  containers: ContainerComponent<HTMLElement, HTMLElement>[] = [];
  constructor(
    templateId: string,
    hostId: string,
    dataPage: string,
    modelData: object,
    public insertAtStart: boolean = true,
    newElementId?: string
  ) {
    super(templateId, hostId, insertAtStart, newElementId);

    // set data-page attribute to find inserted pages into the DOM
    this.element.setAttribute("data-page", dataPage);
  }

  override render(): void {
    this.element.classList.add("is-active");
    super.render();

    this.createContainers();
  }

  createContainers(): void {
    this.containers = [];
    const containerTemplates = this.element.getElementsByClassName(
      "ContainerClass"
    ) as HTMLCollectionOf<HTMLElement>;

    const pageElement = this.element;

    for (const containerTemplate of containerTemplates) {
      const newContainer = new ContainerClass(
        containerTemplate.id,
        containerTemplate.id,
        this
      );
      this.containers.push(newContainer);
    }
  }
}

export class ContainerClass<T extends HTMLElement, U extends HTMLElement>
  extends ComponentClass<T, U>
  implements ContainerComponent<T, U>
{
  items: ItemComponent<U, HTMLElement>[] = [];

  constructor(
    templateId: string,
    hostId: string,
    page: Object,
    public insertAtStart: boolean = true,
    newElementId?: string
  ) {
    super(templateId, hostId, insertAtStart, newElementId);
  }

  addItem(item: ItemComponent<U, HTMLElement>): void {
    this.items.push(item);
    item.render();
  }

  removeItem(id: string): void {
    const item = this.items.find((item) => item.id === id);
    if (item) {
      this.items.splice(this.items.indexOf(item), 1);
      item.element.remove();
    }
  }

  override render(): void {
    const parent = this.hostElement.parentNode as HTMLElement;
    parent.insertBefore(this.element, this.hostElement);
  }

  filterItems(filter: (item: ItemComponent<U, HTMLElement>) => boolean): void {
    this.items = this.items.filter((item: Component<U, HTMLElement>) => {
      // ...
    });
  }
}

export class ItemClass<U extends HTMLElement, T extends HTMLElement>
  extends ComponentClass<T, U>
  implements ItemComponent<T, U>
{
  constructor(
    templateId: string,
    hostId: string,
    public id: string,
    page: object,
    public insertAtStart: boolean = true,
    newElementId?: string
  ) {
    super(templateId, hostId, insertAtStart, newElementId);
  }
}
