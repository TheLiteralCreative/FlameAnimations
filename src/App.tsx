import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from './components/Canvas'
import { Toolbar } from './components/Toolbar'
import { Gallery } from './components/Gallery'
import { ConfirmDialog } from './components/ConfirmDialog'
import { HelpModal } from './components/HelpModal'
import { ToastStack } from './components/Toast'
import { useApp } from './state/AppContext'
import { useHistory } from './hooks/useHistory'
import { useGallery } from './hooks/useGallery'
import { defaultArtworkTitle, pngFilename } from './lib/filename'

const HELP_SEEN_KEY = 'flameanimations.helpSeen'

export default function App() {
  const { engine, tool, setTool, notify } = useApp()
  const history = useHistory(engine)
  const gallery = useGallery()

  const [confirmClearOpen, setConfirmClearOpen] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const initialSnapshotTaken = useRef(false)

  useEffect(() => {
    if (initialSnapshotTaken.current) return
    initialSnapshotTaken.current = true
    history.reset()
  }, [history])

  useEffect(() => {
    if (!localStorage.getItem(HELP_SEEN_KEY)) {
      setHelpOpen(true)
      localStorage.setItem(HELP_SEEN_KEY, '1')
    }
  }, [])

  const handleStrokeEnd = useCallback(() => {
    history.push()
  }, [history])

  const handleClear = useCallback(() => {
    setConfirmClearOpen(true)
  }, [])

  const confirmClear = useCallback(async () => {
    engine.clear()
    await history.push()
    setConfirmClearOpen(false)
    notify('Canvas cleared', 'info')
  }, [engine, history, notify])

  const handleExport = useCallback(async () => {
    const blob = await engine.toBlob()
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
      const blob = await engine.toBlob()
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
      notify('Saved to gallery', 'success')
    } catch (e) {
      notify(
        e instanceof Error ? `Save failed: ${e.message}` : 'Save failed',
        'error',
      )
    }
  }, [engine, gallery, notify])

  const handleOpenArtwork = useCallback(
    async (id: string) => {
      try {
        const record = await gallery.get(id)
        if (!record) return
        await engine.restoreFromBlob(record.full)
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
    [engine, gallery, history, notify],
  )

  const handleDeleteArtwork = useCallback(
    async (id: string) => {
      await gallery.remove(id)
      notify('Deleted', 'info')
    },
    [gallery, notify],
  )

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
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [history, setTool, tool.brushSize, handleSave, handleExport])

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
      />
      <main className="stage">
        <Canvas onStrokeEnd={handleStrokeEnd} />
      </main>

      <ConfirmDialog
        open={confirmClearOpen}
        title="Clear the canvas?"
        message="This will erase everything currently on the canvas. Your saved gallery is safe."
        confirmLabel="Clear"
        cancelLabel="Keep drawing"
        destructive
        onConfirm={confirmClear}
        onCancel={() => setConfirmClearOpen(false)}
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
