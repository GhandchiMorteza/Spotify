import { Component } from "../interfaces";
// This is an abstract class that defines the common functionality for all components.
export abstract class ComponentClass<
  T extends HTMLElement,
  U extends HTMLElement
> implements Component<T, U>
{
  // This is a property that stores the template element for the component.
  templateElement: HTMLTemplateElement;

  // This is a property that stores the host element for the component.
  hostElement: T;

  // This is a property that stores the rendered element for the component.
  element: U;
  visible: boolean;

  constructor(
    templateId: string,
    hostId: string,
    public insertAtStart: boolean = true,
    newElementId?: string,
    visible: boolean = true
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
    this.render((this.visible = true));
  }

  // This method adds the specified classes to the component's element.
  addClasses(...classNames: string[]) {
    this.element.classList.add(...classNames);
  }

  // This method adds the specified event listener to the component's element.
  addEventListener(event: string, callback: (event: Event) => void) {
    this.element.addEventListener(event, callback);
  }

  // This method renders the component's element into the DOM.
  render(visible: boolean = true) {
    this.hostElement.insertAdjacentElement(
      this.insertAtStart ? "afterbegin" : "beforeend",
      this.element
    );
  }
}
