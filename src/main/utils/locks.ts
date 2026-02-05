export class AsyncLock {
  private chains = new Map<string, Promise<unknown>>()

  async acquire<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const prev = this.chains.get(key) ?? Promise.resolve()
    const next = prev.then(fn).catch((err) => { throw err })
    // Ensure chain continues even if fn throws, to not block future acquires
    this.chains.set(key, next.catch(() => {}))
    return next as Promise<T>
  }
}

export const statusUpdateLock = new AsyncLock()

