// Test double for IntersectionObserver: records instances and lets a test
// report an entry for the observed element.
export class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];

  readonly callback: IntersectionObserverCallback;
  readonly options: IntersectionObserverInit | undefined;
  readonly observed = new Set<Element>();
  disconnected = false;

  constructor(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    this.callback = callback;
    this.options = options;
    FakeIntersectionObserver.instances.push(this);
  }

  static reset() {
    FakeIntersectionObserver.instances = [];
  }

  static latest() {
    const instance = FakeIntersectionObserver.instances.at(-1);

    if (!instance) {
      throw new Error("No IntersectionObserver was created");
    }

    return instance;
  }

  observe(element: Element) {
    this.observed.add(element);
  }

  unobserve(element: Element) {
    this.observed.delete(element);
  }

  disconnect() {
    this.disconnected = true;
    this.observed.clear();
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  // `true` reports the element fully in view, `false` out of view.
  trigger(isIntersecting: boolean) {
    this.triggerPartial(
      isIntersecting
        ? { ratio: 1, rootHeight: 800, visibleHeight: 100 }
        : { ratio: 0, rootHeight: 800, visibleHeight: 0 },
    );
  }

  // Reports an element that is only partly in view.
  triggerPartial({
    ratio,
    rootHeight,
    visibleHeight,
  }: {
    ratio: number;
    rootHeight: number;
    visibleHeight: number;
  }) {
    const entries = [...this.observed].map(
      (target) =>
        ({
          intersectionRatio: ratio,
          intersectionRect: { height: visibleHeight },
          isIntersecting: ratio > 0,
          rootBounds: { height: rootHeight },
          target,
        }) as unknown as IntersectionObserverEntry,
    );

    this.callback(entries, this as unknown as IntersectionObserver);
  }
}
