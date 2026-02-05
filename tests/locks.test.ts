import { describe, it, expect } from 'vitest'
import { AsyncLock } from '../src/main/utils/locks'

describe('AsyncLock', () => {
  it('runs tasks sequentially per key', async () => {
    const lock = new AsyncLock()
    const order: number[] = []

    const task = async (id: number, delay = 10) => {
      await new Promise((r) => setTimeout(r, delay))
      order.push(id)
    }

    await Promise.all([
      lock.acquire('a', () => task(1, 30)),
      lock.acquire('a', () => task(2, 10)),
      lock.acquire('a', () => task(3, 0))
    ])

    expect(order).toEqual([1, 2, 3])
  })

  it('different keys run concurrently', async () => {
    const lock = new AsyncLock()
    const start = Date.now()

    await Promise.all([
      lock.acquire('x', async () => new Promise((r) => setTimeout(r, 50))),
      lock.acquire('y', async () => new Promise((r) => setTimeout(r, 50)))
    ])

    const duration = Date.now() - start
    expect(duration).toBeLessThan(100)
  })
})

