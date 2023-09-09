import { ComponentClass } from "./componentClass";
import { ContainerClass } from "./containerClass";
import { ContainerComponent } from "../interfaces";

export class PageClass<
  T extends HTMLElement,
  U extends HTMLElement
> extends ComponentClass<T, U> {
  // This property stores the page containers for the component.
  pageContainers: Record<string, ContainerClass<HTMLElement, HTMLElement>> = {};

  constructor(
    public templateId: string,
    public hostId: string,
    public dataPage: string,
    public modelData: any,
    public visible: boolean = true,
    public insertAtStart: boolean = true,
    newElementId?: string
  ) {
    super(templateId, hostId, insertAtStart, newElementId, visible);

    // set data-page attribute to find inserted pages into the DOM.
    this.element.setAttribute("data-page", dataPage);
    if (!visible) {
      this.element.classList.remove("is-active");
    }
    this.createContainers();
  }

  override render(visible: boolean): void {
    // Add the is-active class to the component's element. This indicates that the page is currently active.
    this.element.classList.add("is-active");
    super.render();
  }

  // This method creates the page containers for the page.
  createContainers(): void {
    // An array of all the <div> elements with the class ContainerClass.
    const containerTemplates = this.element.getElementsByClassName(
      "ContainerClass"
    ) as HTMLCollectionOf<HTMLElement>;

    // For each `<div>` element in the `containerTemplates` array, create a new `ContainerClass` component and add it to the `pageContainers` array.
    for (let i = 0; i < containerTemplates.length; i++) {
      const containerTemplate = containerTemplates[i];

      const newContainer = new ContainerClass(
        containerTemplate.id,
        containerTemplate.id,
        this.modelData[i]
      );

      this.pageContainers[containerTemplate.id] = newContainer;
    }
  }

  // Function to access a container by its id
  getContainerById(
    containerId: string
  ): ContainerComponent<HTMLElement, HTMLElement> | undefined {
    return this.pageContainers[containerId];
  }
}
