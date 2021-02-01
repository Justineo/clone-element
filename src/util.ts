import {
  SupportedElement,
  SupportedElementTagName,
  SupportedElementTagNameMap,
} from "./types";

export function isTagName<T extends SupportedElementTagName>(
  el: SupportedElement,
  tagNames: T[]
): el is SupportedElementTagNameMap[T] {
  return (tagNames as string[]).indexOf(el.tagName.toLowerCase()) !== -1;
}
