const fs = require('fs')
const path = require('path')

const IMAGE_DIRS = ['images', 'assets']
const MAX_BYTES = 500 * 1024 // 500KB
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']

let totalFiles = 0
let totalBytes = 0
const violations = []
const warnings = []

function scanDir(dir) {
  if (!fs.existsSync(dir)) return

  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      scanDir(fullPath)
      continue
    }

    const ext = path.extname(entry.name).toLowerCase()
    if (!IMAGE_EXTS.includes(ext)) continue

    const stat = fs.statSync(fullPath)
    totalFiles++
    totalBytes += stat.size

    if (stat.size > MAX_BYTES) {
      violations.push(`  FAIL: ${fullPath} — ${(stat.size / 1024).toFixed(1)}KB exceeds 500KB limit`)
    }

    if (ext === '.png' && stat.size > 100 * 1024) {
      warnings.push(`  WARN: ${fullPath} — large PNG; consider converting to .webp`)
    }

    if (/[A-Z\s]/.test(entry.name)) {
      warnings.push(`  WARN: ${fullPath} — filename contains uppercase or spaces`)
    }
  }
}

for (const dir of IMAGE_DIRS) {
  scanDir(dir)
}

console.log(`\n--- Image Audit ---`)
console.log(`Files scanned: ${totalFiles}`)
console.log(`Total size:    ${(totalBytes / 1024).toFixed(1)}KB`)

if (warnings.length) {
  console.log(`\nWarnings (${warnings.length}):`)
  warnings.forEach(w => console.log(w))
}

if (violations.length) {
  console.log(`\nViolations (${violations.length}):`)
  violations.forEach(v => console.log(v))
  console.log('\nImage audit FAILED.')
  process.exit(1)
}

console.log('\nImage audit passed.')
