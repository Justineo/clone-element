import { getDefaultStyleInfo, getStyleInfo, patchStyle } from "./style";
import { patchElement } from "./element";
import { SupportedElement } from "./types";

export default function cloneElement(source: Element): Element {
  const target = source.cloneNode(true) as Element;

  const targetElements = [target].concat(
    Array.from(target.querySelectorAll("*"))
  );
  const sourceElements = [source].concat(
    Array.from(source.querySelectorAll("*"))
  );

  if (targetElements.length !== sourceElements.length) {
    throw new Error(
      "[clone-element] Cannot correctly clone the given element."
    );
  }

  const styleInfoList = sourceElements.map((s) =>
    getStyleInfo(s as SupportedElement)
  );

  targetElements.forEach((t, i) => {
    const s = sourceElements[i];
    patchElement(
      t as SupportedElement,
      s as SupportedElement,
      styleInfoList[i]
    );
  });

  document.body.appendChild(target);
  const defaultStyleInfoList = targetElements.map((t) =>
    getDefaultStyleInfo(t as SupportedElement)
  );
  document.body.removeChild(target);

  targetElements.forEach((t, i) => {
    patchStyle(
      t as SupportedElement,
      styleInfoList[i],
      defaultStyleInfoList[i]
    );
  });

  return target;
}
