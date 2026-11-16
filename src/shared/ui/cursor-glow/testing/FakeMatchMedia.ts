import { vi } from "vitest";

type Listener = () => void;

// Controllable window.matchMedia: set the answer per query and notify listeners.
export class FakeMatchMedia {
  private readonly answers = new Map<string, boolean>();
  private readonly listeners = new Map<string, Set<Listener>>();

  install() {
    vi.stubGlobal("matchMedia", (query: string) => ({
      addEventListener: (_type: string, listener: Listener) => {
        this.listenersFor(query).add(listener);
      },
      matches: this.answers.get(query) ?? false,
      media: query,
      removeEventListener: (_type: string, listener: Listener) => {
        this.listenersFor(query).delete(listener);
      },
    }));
  }

  set(query: string, matches: boolean) {
    this.answers.set(query, matches);
    this.listenersFor(query).forEach((listener) => listener());
  }

  listenerCount() {
    return [...this.listeners.values()].reduce(
      (total, set) => total + set.size,
      0,
    );
  }

  private listenersFor(query: string) {
    const existing = this.listeners.get(query);

    if (existing) {
      return existing;
    }

    const created = new Set<Listener>();
    this.listeners.set(query, created);

    return created;
  }
}
