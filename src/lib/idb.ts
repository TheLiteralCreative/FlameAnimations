import type { AnimationDoc, Artwork, SavedArtworkSummary } from '../types'

const DB_NAME = 'flameanimations'
const DB_VERSION = 2
const ART_STORE = 'artworks'
const ANIM_STORE = 'animations'
const CURRENT_ANIM_ID = 'current'

let dbPromise: Promise<IDBDatabase> | null = null

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(ART_STORE)) {
        const store = db.createObjectStore(ART_STORE, { keyPath: 'id' })
        store.createIndex('createdAt', 'createdAt')
      }
      if (!db.objectStoreNames.contains(ANIM_STORE)) {
        db.createObjectStore(ANIM_STORE, { keyPath: 'id' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  return dbPromise
}

function txArt(db: IDBDatabase, mode: IDBTransactionMode) {
  return db.transaction(ART_STORE, mode).objectStore(ART_STORE)
}

function txAnim(db: IDBDatabase, mode: IDBTransactionMode) {
  return db.transaction(ANIM_STORE, mode).objectStore(ANIM_STORE)
}

export async function listArtworks(): Promise<SavedArtworkSummary[]> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const store = txArt(db, 'readonly')
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
    const req = txArt(db, 'readonly').get(id)
    req.onsuccess = () => resolve(req.result as Artwork | undefined)
    req.onerror = () => reject(req.error)
  })
}

export async function saveArtwork(record: Artwork): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const req = txArt(db, 'readwrite').put(record)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

export async function deleteArtwork(id: string): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const req = txArt(db, 'readwrite').delete(id)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

export async function loadCurrentAnimation(): Promise<AnimationDoc | undefined> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const req = txAnim(db, 'readonly').get(CURRENT_ANIM_ID)
    req.onsuccess = () => resolve(req.result as AnimationDoc | undefined)
    req.onerror = () => reject(req.error)
  })
}

export async function saveCurrentAnimation(
  doc: Omit<AnimationDoc, 'id'>,
): Promise<void> {
  const db = await openDb()
  const record: AnimationDoc = { ...doc, id: CURRENT_ANIM_ID }
  return new Promise((resolve, reject) => {
    const req = txAnim(db, 'readwrite').put(record)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

export async function clearCurrentAnimation(): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const req = txAnim(db, 'readwrite').delete(CURRENT_ANIM_ID)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}
