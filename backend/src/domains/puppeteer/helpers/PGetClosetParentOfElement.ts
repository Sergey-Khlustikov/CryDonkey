import {ElementHandle} from "puppeteer";

async function PGetClosestParentOfElement(
  element: ElementHandle,
  parentSelector: string
): Promise<ElementHandle<Element> | null> {
  // Use evaluateHandle to ensure the returned value is an ElementHandle
  const closestParentHandle = await element.evaluateHandle((el, selector) => {
    return el.closest(selector);
  }, parentSelector);

  // Return the result as an ElementHandle<Element> or null
  return closestParentHandle.asElement() as ElementHandle<Element> | null;
}

export default PGetClosestParentOfElement
