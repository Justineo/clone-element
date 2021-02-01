import { isTagName } from "./util";
import {
  StyleInfo,
  ElementStyleInfo,
  PesudoStyleInfoMap,
  SupportedElement,
  StyleSnapshot,
  SupportedElementTagName,
} from "./types";

/**
 * Surprisingly, <style> element can be appended to <input> and <textarea>
 * so we can support ::placeholder, and ::selection even for them.
 */
const SUPPORTED_PSEUDO_SELECTORS = [
  "::after",
  "::before",
  "::first-letter",
  "::first-line",
  "::marker",
  "::placeholder",
  "::selection",
];

const REPLACED_ELEMENTS: SupportedElementTagName[] = [
  "iframe",
  "video",
  "embed",
  "img",
  "audio",
  "option",
  "canvas",
  "object",
  "applet",
];

const VOID_ELEMENTS: SupportedElementTagName[] = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
];

const NO_GENERATE_CONTENT_ELEMENTS = REPLACED_ELEMENTS.concat(VOID_ELEMENTS);

const PLACEHOLDER_ELEMENTS: SupportedElementTagName[] = ["input", "textarea"];

const SKIPPED_PROPERTIES = ["-webkit-locale"];

function setDefault(elem: SupportedElement): () => void {
  const style = elem.getAttribute("style");
  elem.style.setProperty("all", "revert", "important");

  return () => {
    if (style) {
      elem.setAttribute("style", style);
    } else {
      elem.removeAttribute("style");
    }
  };
}

export function getDefaultStyleInfo(
  source: SupportedElement,
  pseudoSelector?: string
): StyleInfo {
  const dispose = setDefault(source);
  const info = getStyleInfo(source, pseudoSelector);
  dispose();

  return info;
}

export function getStyleInfo(
  source: SupportedElement,
  pseudoSelector?: string
): StyleInfo {
  const computed = window.getComputedStyle(source, pseudoSelector);
  const style = getStyleSnapshot(computed);
  const { display, content } = style;

  if (display === "none" || (pseudoSelector && content === "none")) {
    return null;
  }

  if (!pseudoSelector) {
    const { width, height } = source.getBoundingClientRect();

    if (width * height === 0) {
      return null;
    }

    const allPseudoStyleInfo: PesudoStyleInfoMap = Object.create(null);

    for (const selector of SUPPORTED_PSEUDO_SELECTORS) {
      const pseudoStyleInfo = getStyleInfo(source, selector);

      if (pseudoStyleInfo) {
        allPseudoStyleInfo[selector] = pseudoStyleInfo;
      }
    }

    return {
      style,
      width: `${width}px`,
      height: `${height}px`,
      pseudo: allPseudoStyleInfo,
    };
  }

  // pseudo elements
  if (
    content === "none" ||
    (pseudoSelector === "::marker" && display !== "list-item") ||
    ((pseudoSelector === "::before" || pseudoSelector === "::after") &&
      isTagName(source as SupportedElement, NO_GENERATE_CONTENT_ELEMENTS)) ||
    (pseudoSelector === "::placeholder" &&
      !isTagName(source as SupportedElement, PLACEHOLDER_ELEMENTS))
  ) {
    return null;
  }

  return {
    style,
  };
}

export function patchStyle(
  target: SupportedElement,
  styleInfo: StyleInfo,
  defaultStyleInfo: StyleInfo
): void {
  if (!styleInfo) {
    return;
  }

  const { style, width, height, pseudo } = styleInfo as ElementStyleInfo;
  const defaultStyle = defaultStyleInfo?.style;
  const pseudoDefault = (defaultStyleInfo as ElementStyleInfo).pseudo;

  const cssText = generateCssText(
    getStyleDiff(style, defaultStyle as StyleSnapshot)
  );
  target.style.cssText = cssText + target.style.cssText;

  /**
   * Patch size
   *
   * TODO: how to deal with inline elements?
   */
  if (style.display !== "inline") {
    target.style.boxSizing = "border-box";
    target.style.width = width;
    target.style.height = height;
    target.style.maxWidth = "none";
    target.style.minWidth = "auto";
  }

  const pseudoCssTextList = [];

  for (const selector in pseudo) {
    const pseudoStyleInfo = pseudo[selector];
    const pseudoDefaultStyleInfo = pseudoDefault[selector];

    const pseudoStyle = pseudoStyleInfo.style;
    const pseudoDefaultStyle = pseudoDefaultStyleInfo.style;
    const cssText = generateCssText(
      getStyleDiff(pseudoStyle, pseudoDefaultStyle)
    );

    const css = generatePseudoElementCSS(target, selector, cssText);

    if (css) {
      pseudoCssTextList.push(css);
    }
  }

  if (pseudoCssTextList.length) {
    const style = createStyleElement(pseudoCssTextList.join("\n"));

    target.appendChild(style);
  }
}

function generatePseudoElementCSS(
  target: SupportedElement,
  selector: string,
  cssText: string
): string {
  if (!cssText) {
    return "";
  }

  return `#${target.id}${selector}{${cssText}}`;
}

function createStyleElement(css: string): HTMLStyleElement {
  const style = document.createElement("style");
  style.appendChild(document.createTextNode(css));

  return style;
}

function getStyleSnapshot(style: CSSStyleDeclaration): StyleSnapshot {
  const snapshot = Object.create({});
  for (let i = 0; i < style.length; i++) {
    const prop = style[i];
    snapshot[prop] = style.getPropertyValue(prop);
  }

  return snapshot;
}

function getStyleDiff(
  currentStyle: StyleSnapshot,
  defaultStyle: StyleSnapshot
): StyleSnapshot {
  const diff = Object.create({});

  for (const key in currentStyle) {
    if (
      SKIPPED_PROPERTIES.indexOf(key) === -1 &&
      currentStyle[key] !== defaultStyle[key]
    ) {
      diff[key] = currentStyle[key];
    }
  }

  return diff;
}

function generateCssText(style: StyleSnapshot): string {
  const declarations = [];

  for (const key in style) {
    declarations.push(`${key}:${style[key]};`);
  }

  return declarations.join("");
}
