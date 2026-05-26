import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { DrawingEngine } from '../lib/drawingEngine'
import { BRUSH_DEFAULT, DEFAULT_PALETTE } from '../lib/palettes'
import type { ToolState } from '../types'

interface ToastMsg {
  id: number
  text: string
  kind: 'info' | 'error' | 'success'
}

interface AppContextValue {
  tool: ToolState
  setTool: (patch: Partial<ToolState>) => void
  engine: DrawingEngine
  toasts: ToastMsg[]
  notify: (text: string, kind?: ToastMsg['kind']) => void
  dismissToast: (id: number) => void
}

const Ctx = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const engineRef = useRef<DrawingEngine | null>(null)
  if (!engineRef.current) engineRef.current = new DrawingEngine()
  const engine = engineRef.current

  const [tool, setToolState] = useState<ToolState>({
    color: DEFAULT_PALETTE[0],
    brushSize: BRUSH_DEFAULT,
    brushShape: 'round',
    mode: 'draw',
    pressureSensitive: true,
  })

  useEffect(() => {
    engine.setTool(tool)
  }, [engine, tool])

  const setTool = useCallback((patch: Partial<ToolState>) => {
    setToolState((prev) => ({ ...prev, ...patch }))
  }, [])

  const [toasts, setToasts] = useState<ToastMsg[]>([])
  const toastIdRef = useRef(0)

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const notify = useCallback(
    (text: string, kind: ToastMsg['kind'] = 'info') => {
      const id = ++toastIdRef.current
      setToasts((prev) => [...prev, { id, text, kind }])
      window.setTimeout(() => dismissToast(id), 2800)
    },
    [dismissToast],
  )

  const value = useMemo<AppContextValue>(
    () => ({ tool, setTool, engine, toasts, notify, dismissToast }),
    [tool, setTool, engine, toasts, notify, dismissToast],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp must be used within AppProvider')
  return v
}
