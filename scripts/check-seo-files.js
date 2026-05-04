const fs = require('fs')
const path = require('path')

const CANONICAL = 'https://playcentralgames.com'
let failed = false

// --- robots.txt ---
if (!fs.existsSync('robots.txt')) {
  console.error('FAIL: robots.txt not found at repo root')
  failed = true
} else {
  const robots = fs.readFileSync('robots.txt', 'utf8')
  if (!robots.includes('Sitemap:')) {
    console.error('FAIL: robots.txt does not reference a Sitemap URL')
    failed = true
  } else {
    console.log('OK: robots.txt present and references sitemap')
  }
}

// --- sitemap.xml ---
if (!fs.existsSync('sitemap.xml')) {
  console.error('FAIL: sitemap.xml not found at repo root')
  failed = true
} else {
  const sitemap = fs.readFileSync('sitemap.xml', 'utf8')

  if (!sitemap.includes(`<loc>${CANONICAL}</loc>`) && !sitemap.includes(`<loc>${CANONICAL}/</loc>`)) {
    console.error(`FAIL: sitemap.xml does not contain a <loc> entry for ${CANONICAL}`)
    failed = true
  } else {
    console.log('OK: sitemap.xml present and contains canonical URL')
  }

  const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'))
  for (const file of htmlFiles) {
    const slug = file === 'index.html' ? '' : file.replace('.html', '')
    const expectedLoc = slug ? `${CANONICAL}/${slug}` : CANONICAL
    if (!sitemap.includes(expectedLoc)) {
      console.error(`FAIL: sitemap.xml missing entry for ${expectedLoc} (derived from ${file})`)
      failed = true
    }
  }
}

if (failed) {
  console.error('\nSEO file check FAILED.')
  process.exit(1)
}

console.log('\nSEO file check passed.')
