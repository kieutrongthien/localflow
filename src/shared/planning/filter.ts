import type { PlanningItem } from './types'

export type PlanningFilters = {
  query?: string
  status?: string
  priority?: string
  epicId?: string
}

const normalize = (value?: string | null) => value?.toLowerCase() ?? ''

export const applyPlanningFilters = (
  items: PlanningItem[],
  filters: PlanningFilters
): PlanningItem[] => {
  const query = normalize(filters.query)
  const status = normalize(filters.status)
  const priority = normalize(filters.priority)
  const epic = normalize(filters.epicId)

  return items.filter((item) => {
    const matchesQuery =
      !query ||
      normalize(item.title).includes(query) ||
      (item.description ? normalize(item.description).includes(query) : false)

    const matchesStatus = !status || normalize(item.status).includes(status)
    const matchesPriority = !priority || normalize(item.priority).includes(priority)
    const matchesEpic =
      !epic ||
      (item.type === 'story' && item.parentEpicId && normalize(item.parentEpicId).includes(epic)) ||
      (item.type === 'task' && item.linkedStoryId && normalize(item.linkedStoryId).includes(epic))

    return matchesQuery && matchesStatus && matchesPriority && matchesEpic
  })
}
