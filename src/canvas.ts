export function patchCanvas(
  target: HTMLCanvasElement,
  source: HTMLCanvasElement
): void {
  const targetCtx = target.getContext("2d");
  targetCtx?.drawImage(source, 0, 0);
}
