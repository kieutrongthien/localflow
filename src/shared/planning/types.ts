export type PlanningKind = 'epic' | 'story' | 'task'

export type PlanningFrontmatterBase = {
  title: string
  status?: string
  priority?: string
  links?: string[]
  tags?: string[]
}

export type PlanningStoryFrontmatter = PlanningFrontmatterBase & {
  type: 'story'
  points?: number | null
  owner?: string
  parentEpicPath?: string
}

export type PlanningTaskFrontmatter = PlanningFrontmatterBase & {
  type: 'task'
  points?: number | null
  assignee?: string
  linkedStoryPath?: string
}

export type PlanningEpicFrontmatter = PlanningFrontmatterBase & {
  type: 'epic'
  childStories?: string[]
}

export type PlanningFrontmatter =
  | PlanningEpicFrontmatter
  | PlanningStoryFrontmatter
  | PlanningTaskFrontmatter

export type PlanningItem = {
  id: string
  filename: string
  type: PlanningKind
  title: string
  status?: string
  priority?: string
  points?: number | null
  links?: string[]
  tags?: string[]
  owner?: string
  assignee?: string
  parentEpicPath?: string
  linkedStoryPath?: string
  path: string
}

export type PlanningIndexResult = {
  projectPath: string
  items: PlanningItem[]
  totals: Record<PlanningKind | 'all', number>
}
