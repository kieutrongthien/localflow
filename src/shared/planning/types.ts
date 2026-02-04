export type PlanningKind = 'epic' | 'story' | 'task'

export type PlanningItem = {
  id: string
  filename: string
  title: string
  status?: string
  priority?: string
  points?: number | null
  links?: string[]
  type: PlanningKind
  path: string
}

export type PlanningIndexResult = {
  projectPath: string
  items: PlanningItem[]
  totals: Record<PlanningKind | 'all', number>
}
