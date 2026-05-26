import type { Artwork, SavedArtworkSummary } from '../types'

const DB_NAME = 'flameanimations'
const DB_VERSION = 1
const STORE = 'artworks'

let dbPromise: Promise<IDBDatabase> | null = null

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' })
        store.createIndex('createdAt', 'createdAt')
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  return dbPromise
}

function tx(db: IDBDatabase, mode: IDBTransactionMode) {
  return db.transaction(STORE, mode).objectStore(STORE)
}

export async function listArtworks(): Promise<SavedArtworkSummary[]> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const store = tx(db, 'readonly')
    const req = store.getAll()
    req.onsuccess = () => {
      const records = req.result as Artwork[]
      const summaries: SavedArtworkSummary[] = records
        .map(({ id, title, createdAt, updatedAt, width, height, thumbnail }) => ({
          id,
          title,
          createdAt,
          updatedAt,
          width,
          height,
          thumbnail,
        }))
        .sort((a, b) => b.updatedAt - a.updatedAt)
      resolve(summaries)
    }
    req.onerror = () => reject(req.error)
  })
}

export async function getArtwork(id: string): Promise<Artwork | undefined> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const req = tx(db, 'readonly').get(id)
    req.onsuccess = () => resolve(req.result as Artwork | undefined)
    req.onerror = () => reject(req.error)
  })
}

export async function saveArtwork(record: Artwork): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const req = tx(db, 'readwrite').put(record)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

export async function deleteArtwork(id: string): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const req = tx(db, 'readwrite').delete(id)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}
