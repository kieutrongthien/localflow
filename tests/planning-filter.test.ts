import { describe, it, expect } from 'vitest'
import { applyPlanningFilters, type PlanningFilters } from '../src/shared/planning/filter'
import type { PlanningItem } from '../src/shared/planning/types'

const makeItem = (overrides: Partial<PlanningItem>): PlanningItem => ({
  id: '001',
  filename: '001-demo.md',
  type: 'story',
  title: 'Viết wizard metadata',
  status: 'In Progress',
  priority: 'High',
  points: 3,
  links: [],
  path: '/tmp/demo',
  ...overrides
})

describe('applyPlanningFilters', () => {
  const items: PlanningItem[] = [
    makeItem({ id: 'E-001', type: 'epic', title: 'Epic onboarding', priority: 'High' }),
    makeItem({ id: 'S-010', type: 'story', title: 'Setup indexer', status: 'Done', priority: 'Medium' }),
    makeItem({ id: 'T-200', type: 'task', title: 'Fix watcher', status: 'In Progress', priority: 'Low' })
  ]

  const run = (filters: PlanningFilters) => applyPlanningFilters(items, filters).map((item) => item.id)

  it('filters by query in title', () => {
    expect(run({ query: 'indexer' })).toEqual(['S-010'])
  })

  it('filters by status', () => {
    expect(run({ status: 'done' })).toEqual(['S-010'])
  })

  it('filters by priority', () => {
    expect(run({ priority: 'low' })).toEqual(['T-200'])
  })

  it('combines filters', () => {
    expect(run({ query: 'setup', status: 'done', priority: 'medium' })).toEqual(['S-010'])
  })
})
