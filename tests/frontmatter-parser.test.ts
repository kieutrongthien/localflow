import { describe, it, expect } from 'vitest'
import matter from 'gray-matter'

const sample = `---
type: story
id: 012-abc
status: todo
priority: medium
points: 3
---

# Title

Desc here
`

describe('Frontmatter parser', () => {
  it('reads and writes frontmatter status', () => {
    const parsed = matter(sample)
    expect(parsed.data.type).toBe('story')
    expect(parsed.data.status).toBe('todo')

    parsed.data.status = 'done'
    const updated = matter.stringify(parsed.content, parsed.data)
    const reparsed = matter(updated)
    expect(reparsed.data.status).toBe('done')
  })
})

