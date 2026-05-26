function pad(n: number) {
  return n.toString().padStart(2, '0')
}

export function pngFilename(now: Date = new Date()) {
  const y = now.getFullYear()
  const m = pad(now.getMonth() + 1)
  const d = pad(now.getDate())
  const hh = pad(now.getHours())
  const mm = pad(now.getMinutes())
  const ss = pad(now.getSeconds())
  return `flameanimations-${y}${m}${d}-${hh}${mm}${ss}.png`
}

export function defaultArtworkTitle(now: Date = new Date()) {
  const y = now.getFullYear()
  const m = pad(now.getMonth() + 1)
  const d = pad(now.getDate())
  const hh = pad(now.getHours())
  const mm = pad(now.getMinutes())
  return `Untitled ${y}-${m}-${d} ${hh}:${mm}`
}
