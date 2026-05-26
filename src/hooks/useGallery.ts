import { useCallback, useEffect, useState } from 'react'
import { deleteArtwork, getArtwork, listArtworks, saveArtwork } from '../lib/idb'
import type { Artwork, SavedArtworkSummary } from '../types'

export function useGallery() {
  const [items, setItems] = useState<SavedArtworkSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const list = await listArtworks()
      setItems(list)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load gallery')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const save = useCallback(
    async (record: Artwork) => {
      await saveArtwork(record)
      await refresh()
    },
    [refresh],
  )

  const remove = useCallback(
    async (id: string) => {
      await deleteArtwork(id)
      await refresh()
    },
    [refresh],
  )

  return { items, loading, error, refresh, save, remove, get: getArtwork }
}
