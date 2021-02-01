declare global {
  interface HTMLVideoElement {
    captureStream(): MediaStream;
    mozCaptureStream(): MediaStream;
  }
}

export function patchVideo(
  target: HTMLVideoElement,
  source: HTMLVideoElement
): void {
  const method = source.captureStream || source.mozCaptureStream;

  target.controls = source.controls && source.paused;

  if (!method) {
    const sync = () => {
      target.currentTime = source.currentTime;
      if (source.paused) {
        target.pause();
      } else {
        target.play();
      }

      target.removeEventListener("canplay", sync);
    };

    target.addEventListener("canplay", sync);

    return;
  }

  const stream = method.call(source);

  target.srcObject = stream;
}
