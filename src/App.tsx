import { useCallback, useEffect, useState } from 'react'
import { Canvas } from './components/Canvas'
import { Toolbar } from './components/Toolbar'
import { Gallery } from './components/Gallery'
import { ConfirmDialog } from './components/ConfirmDialog'
import { HelpModal } from './components/HelpModal'
import { ToastStack } from './components/Toast'
import { FrameDeck } from './components/FrameDeck'
import { Filmstrip } from './components/Filmstrip'
import { OnionControls } from './components/OnionControls'
import { useApp } from './state/AppContext'
import { useHistory } from './hooks/useHistory'
import { useGallery } from './hooks/useGallery'
import { useAnimation } from './hooks/useAnimation'
import { defaultArtworkTitle, pngFilename } from './lib/filename'
import { encodeAnimationToGif } from './lib/exportGif'
import { MAX_FRAMES, DEFAULT_FPS } from './types'

const HELP_SEEN_KEY = 'flameanimations.helpSeen'

function gifFilename(now: Date = new Date()) {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `flameanimations-anim-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}.gif`
}

export default function App() {
  const { engine, tool, setTool, notify } = useApp()
  const history = useHistory(engine)
  const gallery = useGallery()

  const [onionEnabled, setOnionEnabled] = useState(false)
  const [onionOpacity, setOnionOpacity] = useState(0.4)
  const [confirmClearOpen, setConfirmClearOpen] = useState(false)
  const [confirmNewAnimOpen, setConfirmNewAnimOpen] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [exporting, setExporting] = useState(false)

  const reportError = useCallback(
    (msg: string) => notify(msg, 'error'),
    [notify],
  )

  const anim = useAnimation({
    engine,
    onionEnabled,
    onionOpacity,
    onError: reportError,
  })

  useEffect(() => {
    if (!anim.ready) return
    history.reset()
  }, [anim.ready, anim.currentIndex, history])

  useEffect(() => {
    if (!localStorage.getItem(HELP_SEEN_KEY)) {
      setHelpOpen(true)
      localStorage.setItem(HELP_SEEN_KEY, '1')
    }
  }, [])

  const handleStrokeEnd = useCallback(async () => {
    await anim.commitCurrentFrame()
    await history.push()
  }, [anim, history])

  const handleClear = useCallback(() => {
    setConfirmClearOpen(true)
  }, [])

  const confirmClear = useCallback(async () => {
    engine.clear()
    await anim.commitCurrentFrame()
    await history.push()
    setConfirmClearOpen(false)
    notify('Frame cleared', 'info')
  }, [engine, anim, history, notify])

  const handleExport = useCallback(async () => {
    const blob = await engine.toExportBlob()
    if (!blob) {
      notify('Could not export. Please try again.', 'error')
      return
    }
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = pngFilename()
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    notify('PNG downloaded', 'success')
  }, [engine, notify])

  const handleSave = useCallback(async () => {
    try {
      const blob = await engine.toExportBlob()
      if (!blob) {
        notify('Could not save. Please try again.', 'error')
        return
      }
      const thumb = engine.generateThumbnail()
      const now = Date.now()
      const id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${now}-${Math.random().toString(36).slice(2)}`
      await gallery.save({
        id,
        title: defaultArtworkTitle(),
        createdAt: now,
        updatedAt: now,
        width: engine.canvas?.width ?? 0,
        height: engine.canvas?.height ?? 0,
        thumbnail: thumb,
        full: blob,
      })
      notify('Frame saved to gallery', 'success')
    } catch (e) {
      notify(
        e instanceof Error ? `Save failed: ${e.message}` : 'Save failed',
        'error',
      )
    }
  }, [engine, gallery, notify])

  const handleExportGif = useCallback(async () => {
    if (anim.frames.length < 1) return
    if (anim.frames.length === 1) {
      notify('Add more frames first — press ▶▶ to make a new frame.', 'info')
      return
    }
    setExporting(true)
    notify('Building GIF…', 'info')
    try {
      const blob = await encodeAnimationToGif(
        anim.frames,
        engine.canvas?.width ?? 1600,
        engine.canvas?.height ?? 1000,
        { fps: DEFAULT_FPS },
        engine,
      )
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = gifFilename()
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      notify('GIF downloaded!', 'success')
    } catch (e) {
      notify(
        e instanceof Error ? `GIF export failed: ${e.message}` : 'GIF export failed',
        'error',
      )
    } finally {
      setExporting(false)
    }
  }, [anim.frames, engine, notify])

  const handleOpenArtwork = useCallback(
    async (id: string) => {
      try {
        const record = await gallery.get(id)
        if (!record) return
        await engine.restoreFromBlob(record.full)
        await anim.commitCurrentFrame()
        await history.reset()
        setGalleryOpen(false)
        notify(`Opened: ${record.title}`, 'info')
      } catch (e) {
        notify(
          e instanceof Error ? `Open failed: ${e.message}` : 'Open failed',
          'error',
        )
      }
    },
    [engine, gallery, anim, history, notify],
  )

  const handleDeleteArtwork = useCallback(
    async (id: string) => {
      await gallery.remove(id)
      notify('Deleted', 'info')
    },
    [gallery, notify],
  )

  const handleNewAnimation = useCallback(() => {
    setConfirmNewAnimOpen(true)
  }, [])

  const confirmNewAnimation = useCallback(async () => {
    await anim.newAnimation()
    await history.reset()
    setConfirmNewAnimOpen(false)
    notify('New animation started', 'info')
  }, [anim, history, notify])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const tag = target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        if (e.shiftKey) history.redo()
        else history.undo()
        return
      }
      if (mod) return
      switch (e.key.toLowerCase()) {
        case 'b':
          setTool({ mode: 'draw' })
          break
        case 'e':
          setTool({ mode: 'erase' })
          break
        case '[':
          setTool({ brushSize: Math.max(1, tool.brushSize - 2) })
          break
        case ']':
          setTool({ brushSize: Math.min(80, tool.brushSize + 2) })
          break
        case 's':
          handleSave()
          break
        case 'd':
          handleExport()
          break
        case '?':
          setHelpOpen(true)
          break
        case 'arrowleft':
          anim.prevFrame()
          break
        case 'arrowright':
          anim.nextFrame()
          break
        case ' ':
          e.preventDefault()
          anim.togglePlay()
          break
        case 'o':
          if (anim.currentIndex > 0) setOnionEnabled((v) => !v)
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [history, setTool, tool.brushSize, handleSave, handleExport, anim])

  const drawingDisabled = anim.playing || !anim.ready
  const canUseOnion = anim.currentIndex > 0 && !anim.playing

  return (
    <div className="app">
      <Toolbar
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        onUndo={history.undo}
        onRedo={history.redo}
        onClear={handleClear}
        onSave={handleSave}
        onExport={handleExport}
        onOpenGallery={() => setGalleryOpen(true)}
        onOpenHelp={() => setHelpOpen(true)}
        disabled={drawingDisabled}
      />

      <FrameDeck
        currentIndex={anim.currentIndex}
        totalFrames={anim.frames.length}
        playing={anim.playing}
        onPrev={anim.prevFrame}
        onNext={anim.nextFrame}
        onTogglePlay={anim.togglePlay}
        onNewAnimation={handleNewAnimation}
        onExportGif={handleExportGif}
        exporting={exporting}
        maxFrames={MAX_FRAMES}
      />

      <main className="stage">
        <Canvas
          onStrokeEnd={handleStrokeEnd}
          drawingEnabled={!drawingDisabled}
          overlay={
            <OnionControls
              enabled={onionEnabled}
              opacity={onionOpacity}
              canUse={canUseOnion}
              onToggle={() => setOnionEnabled((v) => !v)}
              onOpacityChange={setOnionOpacity}
            />
          }
        />
      </main>

      <Filmstrip
        frames={anim.frames}
        currentIndex={anim.currentIndex}
        onSelect={anim.goToFrame}
        disabled={anim.playing}
      />

      <ConfirmDialog
        open={confirmClearOpen}
        title="Clear this frame?"
        message="This erases the current frame only. Other frames are safe."
        confirmLabel="Clear frame"
        cancelLabel="Keep drawing"
        destructive
        onConfirm={confirmClear}
        onCancel={() => setConfirmClearOpen(false)}
      />

      <ConfirmDialog
        open={confirmNewAnimOpen}
        title="Start a brand new animation?"
        message="All your current frames will be deleted. Make sure you exported a GIF first if you want to keep them."
        confirmLabel="Start fresh"
        cancelLabel="Keep my animation"
        destructive
        onConfirm={confirmNewAnimation}
        onCancel={() => setConfirmNewAnimOpen(false)}
      />

      <Gallery
        open={galleryOpen}
        items={gallery.items}
        loading={gallery.loading}
        error={gallery.error}
        onClose={() => setGalleryOpen(false)}
        onOpenArtwork={handleOpenArtwork}
        onDeleteArtwork={handleDeleteArtwork}
      />

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />

      <ToastStack />
    </div>
  )
}
