export class Clock {
  /**
   *
   * @param {import("kaboom").GameObj<T>} ctx
   * @param {() => void} callback
   * @param {number} seconds
   * @param {number} fps
   */
  static cronometer(ctx, callback, seconds, fps = 30) {
    const interval = 1000 / fps;
    const totalFrames = seconds * fps;
    let currentFrame = 0;
    const timer = setInterval(() => {
      if (currentFrame >= totalFrames) {
        clearInterval(timer);
        callback();
      }
      currentFrame += 1;
    }, interval);
    return timer;
  }
}
