import { vi } from "vitest";

// Manual requestAnimationFrame: frames only run when flush() is called.
export class FakeAnimationFrame {
  private nextId = 1;
  private now = 0;
  private readonly callbacks = new Map<number, FrameRequestCallback>();

  install() {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      const id = this.nextId;
      this.nextId += 1;
      this.callbacks.set(id, callback);

      return id;
    });
    vi.stubGlobal("cancelAnimationFrame", (id: number) => {
      this.callbacks.delete(id);
    });
  }

  get pending() {
    return this.callbacks.size;
  }

  // Runs the frames queued now; frames they queue wait for the next call.
  // Each frame carries a timestamp `frameMs` later than the one before.
  flush(frames = 1, frameMs = 1000 / 60) {
    for (let frame = 0; frame < frames; frame += 1) {
      const queued = [...this.callbacks.entries()];
      this.callbacks.clear();
      this.now += frameMs;
      queued.forEach(([, callback]) => callback(this.now));
    }
  }
}
