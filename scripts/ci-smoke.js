#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const run = (cmd, args, opts = {}) =>
  new Promise((resolve) => {
    const p = spawn(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32', ...opts })
    p.on('close', (code) => resolve({ cmd: `${cmd} ${args.join(' ')}`, code }))
  })

const main = async () => {
  const results = []
  const testRes = await run('npm', ['test'])
  results.push(testRes)
  const buildRes = await run('npm', ['run', 'build'])
  results.push(buildRes)
  // Optionally package on Linux/macOS; skip on Windows for speed
  let pkgRes = null
  if (process.platform !== 'win32') {
    pkgRes = await run('npm', ['run', 'package'])
    results.push(pkgRes)
  }

  const summary = {
    startedAt: Date.now(),
    results,
    success: testRes.code === 0 && buildRes.code === 0,
    packageStatus: pkgRes ? { code: pkgRes.code } : null
  }

  const outDir = path.join(process.cwd(), 'dist')
  await mkdir(outDir, { recursive: true })
  await writeFile(path.join(outDir, 'ci-report.json'), JSON.stringify(summary, null, 2), 'utf-8')

  console.log('\n=== CI Smoke Summary ===')
  results.forEach((r) => console.log(`${r.cmd} → exit ${r.code}`))
  if (summary.packageStatus) console.log(`Packaging exit: ${summary.packageStatus.code} (non-blocking)`)
  console.log(`Overall (tests+build): ${summary.success ? 'SUCCESS' : 'FAILURE'}`)

  process.exit(summary.success ? 0 : 1)
}

main().catch((e) => {
  console.error('CI smoke failed unexpectedly:', e)
  process.exit(1)
})
