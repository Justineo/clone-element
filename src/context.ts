const INHERITED_ATTRS = ["dir", "lang", "disabled"];

export function patchContext(target: Element, source: Element): void {
  const attrs = INHERITED_ATTRS.concat([]);
  const seen = Object.create(null);
  let current: Element | null = source;

  patch: while (current) {
    for (let i = 0; i < attrs.length; i++) {
      const key = attrs[i];

      if (seen[key]) {
        return;
      }

      const attr = current.getAttribute(key);
      if (attr !== null) {
        target.setAttribute(key, attr);
        seen[key] = true;

        if (Object.keys(seen).length === attrs.length) {
          break patch;
        }
      }
    }

    current = current.parentElement;
  }
}

/**
 * Context
 *
 * dir -> :dir
 * lang -> :lang
 * disabled
 */
