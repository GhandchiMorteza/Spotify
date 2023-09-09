import { ComponentClass } from "./componentClass";
import { ItemClass } from "./itemClass";
import { ContainerComponent } from "../interfaces";

export class ContainerClass<T extends HTMLElement, U extends HTMLElement>
  extends ComponentClass<T, U>
  implements ContainerComponent<T, U>
{
  items: ItemClass[];

  constructor(
    public templateId: string,
    public hostId: string,
    public modelData: any,
    public insertAtStart: boolean = true,
    newElementId?: string
  ) {
    super(templateId, hostId, insertAtStart, newElementId);
    this.items = [];

    this.addItems();
    // Attach listeners to containers using event delegation
    this.attachListeners();
  }

  attachListeners() {
    // This event listener is used to handle clicks on the items in the containers event delegation
    this.element.addEventListener("click", (event: Event) => {
      // An array of all the elements that were clicked on
      const path = event.composedPath();

      // This filter returns only the elements with the `dataset` property.
      const htmlElementsWithDataset = path.filter(
        (element): element is HTMLElement => {
          return (
            element instanceof HTMLElement && element.dataset !== undefined
          );
        }
      );

      const itemHasURL = htmlElementsWithDataset.find(
        (element) => element.dataset.url !== undefined
      );

      const iconElement = path.find((element) => {
        return element instanceof Element && element.classList.contains("icon");
      }) as Element;

      if (iconElement && iconElement.classList.contains("icon-Close")) {
        if (itemHasURL && itemHasURL.dataset.url) {
          this.removeItemByDataUrl(itemHasURL.dataset.url as string);
          const customEvent = new CustomEvent("removeSearch", {
            detail: itemHasURL.dataset.url,
          });
          window.dispatchEvent(customEvent);
          return;
        }
      }

      // Go to `dataset.url` URL.
      if (itemHasURL) {
        const itemAsHTMLElement = itemHasURL as HTMLElement;
        const itemUrl = itemAsHTMLElement.dataset.url;

        if (itemAsHTMLElement) {
          if (this.templateId === "SearchResultsContainerItmes") {
            const customEvent = new CustomEvent("searchCliked", {
              detail: itemUrl,
            });
            window.dispatchEvent(customEvent);
          }

          if (
            itemUrl?.split("/")[1] === "player" &&
            !(this.templateId === "SearchResultsContainerItmes") &&
            !(this.templateId === "RecentSearchContainerItmes")
          ) {
            const event = new CustomEvent("play-inplace", {
              detail: itemUrl,
            });
            window.dispatchEvent(event);

            return;
          }

          const event = new CustomEvent("go", {
            detail: {
              page: itemUrl,
            },
          });
          window.dispatchEvent(event);
        }
      }
    });
  }

  addItems(): void {
    this.items = (this.modelData as any[]).map(
      (data) => new ItemClass(data, this.templateId)
    );
    if (this.items.length > 0) {
      this.renderItems();
    }
  }

  renderItems() {
    // const concatenatedMarkup = this.items
    //   .map((item) => item.itemMarkup)
    //   .join("");
    // const tempElement = document.createElement("div");
    // tempElement.innerHTML = concatenatedMarkup;

    // const fragment = document.createDocumentFragment();

    // while (tempElement.firstChild) {
    //   fragment.appendChild(tempElement.firstChild);
    // }

    // this.element.appendChild(fragment);
    this.items.forEach((item) => {
      this.element.appendChild(item.element);
    });
  }

  addItem(itemData: any): void {
    const newItem = new ItemClass(itemData, this.templateId);
    this.items.push(newItem);
    this.renderItem(newItem);
  }

  renderItem(item: ItemClass): void {
    this.element.appendChild(item.element);
  }

  override render(): void {
    const parent = this.hostElement.parentNode as HTMLElement;
    parent.insertBefore(this.element, this.hostElement);
  }

  /**
   * Filter items based on a class within the item markup and filter value.
   * @param className The class name within the item markup to filter by.
   * @param filterValue The filter value to match against the item content.
   */
  filterItems(className: string, filterValue: string): void {
    this.items.forEach((item) => {
      const subject = item.element.querySelector(`.${className}`);

      if (subject) {
        const itemText = subject.textContent!.toLowerCase();

        const itemVisible = itemText.includes(filterValue.toLowerCase());

        item.element.style.display = itemVisible ? "flex" : "none";
      }
    });
  }

  clearItems(): void {
    // Remove all previous items
    this.element.innerHTML = "";
  }

  /**
   * Update all items in the container with new data.
   * @param newData An array of new data to update the items.
   */
  updateItems(newData: any[]): void {
    this.clearItems();

    this.items = newData.map((data) => new ItemClass(data, this.templateId));

    this.renderItems();
  }

  /**
   * Remove an item from the container based on its data-url attribute.
   * @param dataUrl The data-url value of the item to be removed.
   */
  removeItemByDataUrl(dataUrl: string): void {
    const indexToRemove = this.items.findIndex((item) => item.url === dataUrl);

    if (indexToRemove !== -1) {
      this.items.splice(indexToRemove, 1);

      const itemToRemove = this.element.querySelector(
        `[data-url="${dataUrl}"]`
      );
      if (itemToRemove) {
        itemToRemove.remove();
      }
    }
  }
}
