import { getUniqueId } from "./id";
import { InputElement } from "./types";

const nameMap = Object.create(null);

export function patchInput(target: InputElement, source: InputElement): void {
  const { name, type } = target;

  /**
   * Sync input values because they are not cloned with cloneNode.
   */
  if (type !== "file") {
    target.value = source.value;
  }

  /**
   * Patch `name` as only one of radio buttons that share the
   * same name can be checked.
   */
  if (name && type === "radio") {
    let mapped = nameMap[name];

    if (!mapped) {
      mapped = nameMap[name] = getUniqueId("clone-name");
    }

    target.name = mapped;
  }

  if (source.disabled) {
    target.disabled = true;
  }
}
