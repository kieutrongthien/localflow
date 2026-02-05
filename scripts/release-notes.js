#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const usage = () => {
  console.log('Usage: node scripts/release-notes.js <projectPath> [outFile]')
}

const mdHeader = (title) => `# Release Notes\n\n${title}\n\n`

const formatActivity = (a) => {
  const ts = new Date(a.createdAt).toLocaleString()
  const payload = (() => { try { return JSON.stringify(a.payload) } catch { return '' } })()
  return `- [${ts}] ${a.type}${payload ? ` — ${payload}` : ''}`
}

const main = async () => {
  const projectPath = process.argv[2]
  const outFile = process.argv[3] || path.join(process.cwd(), 'dist', 'RELEASE_NOTES.md')
  if (!projectPath) { usage(); process.exit(1) }
  // Read activity db via IPC is not available here; read JSON export from ci-report if present, else minimal
  let activity = []
  try {
    const actPath = path.join(projectPath, '.localflow_activity.json')
    const raw = await readFile(actPath, 'utf-8')
    activity = JSON.parse(raw)
  } catch {}

  const lines = []
  lines.push(mdHeader(`Project: ${projectPath}`))
  if (activity.length) {
    lines.push('## Recent Activity')
    lines.push('')
    for (const a of activity.slice(-50)) {
      lines.push(formatActivity(a))
    }
    lines.push('')
  } else {
    lines.push('No activity log found.\n')
  }

  await writeFile(outFile, lines.join('\n'), 'utf-8')
  console.log('Release notes written to', outFile)
}

main().catch((e) => { console.error('Release notes failed:', e); process.exit(1) })
