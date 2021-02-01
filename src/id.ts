let counter = Math.floor(Math.random() * 667384);

export function getUniqueId(prefix?: string): string {
  const leading = prefix ? `${prefix}-` : "";
  return leading + (counter++).toString(36);
}

export function patchId(target: Element): void {
  target.id = getUniqueId("clone-id");
}
