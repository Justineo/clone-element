import { patchInput } from "./input";
import { patchCanvas } from "./canvas";
import { patchVideo } from "./video";
import { SupportedElement, StyleInfo } from "./types";
import { patchId } from "./id";
import { isTagName } from "./util";
import { patchContext } from "./context";

export function patchElement(
  target: SupportedElement,
  source: SupportedElement,
  styleInfo: StyleInfo
): void {
  if (!styleInfo) {
    // invisible elements don't need to be patched
    return;
  }
  patchId(target);
  patchContext(target, source);

  if (isTagName(target, ["input", "textarea", "select"])) {
    patchInput(target, source as typeof target);
  } else if (isTagName(target, ["canvas"])) {
    patchCanvas(target, source as typeof target);
  } else if (isTagName(target, ["video"])) {
    patchVideo(target, source as typeof target);
  }
}
