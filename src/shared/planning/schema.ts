import { z } from 'zod'
import type { PlanningFrontmatter, PlanningKind } from './types'

const baseSchema = z.object({
  title: z.string().min(1),
  status: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  links: z.array(z.string().url()).optional(),
  tags: z.array(z.string().min(1)).optional()
})

const storySchema = baseSchema.extend({
  type: z.literal('story'),
  points: z.number().int().positive().optional(),
  owner: z.string().optional(),
  parentEpicPath: z.string().min(1).optional()
})

const taskSchema = baseSchema.extend({
  type: z.literal('task'),
  points: z.number().int().positive().optional(),
  assignee: z.string().optional(),
  linkedStoryPath: z.string().min(1).optional()
})

const epicSchema = baseSchema.extend({
  type: z.literal('epic'),
  childStories: z.array(z.string().min(1)).optional()
})

export const planningSchema = z.discriminatedUnion('type', [epicSchema, storySchema, taskSchema])

export type PlanningSchema = typeof planningSchema

export const validateFrontmatter = (kind: PlanningKind, data: unknown): PlanningFrontmatter => {
  const schema = planningSchema.refine((value) => value.type === kind, {
    message: `Frontmatter type mismatch (${kind})`
  })

  return schema.parse(data)
}
