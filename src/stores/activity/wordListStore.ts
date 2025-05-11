import { defineStore } from 'pinia'
import { openDB } from 'idb'

const DB_NAME = 'name-of-the-game-db'
const STORE_NAME = 'activity-word-list-store'

export type WordEntry = {
    word: string
    difficulty: string
    forbidden: string[]
    category: string
}

export const useWordListStore = defineStore('wordList', {
    state: () => ({
        wordLists: {
            de: [] as WordEntry[],
            en: [] as WordEntry[],
        },
        isInitialized: false,
    }),
    persist: true,
    actions: {
        async init() {
            if (this.isInitialized) return

            const db = await openDB(DB_NAME, 1, {
                upgrade(db) {
                    if (!db.objectStoreNames.contains(STORE_NAME)) {
                        db.createObjectStore(STORE_NAME, { keyPath: 'key' })
                    }
                },
            })

            const tx = db.transaction(STORE_NAME, 'readonly')
            const store = tx.objectStore(STORE_NAME)

            const deData = await store.get('de')
            const enData = await store.get('en')

            if (deData && enData) {
                this.wordLists.de = deData.data
                this.wordLists.en = enData.data
            } else {
                // Fetch from local files if not in DB
                const [deJson, enJson] = await Promise.all([
                    fetch('/games/activity/word-list-de.json').then(res => res.json()),
                    fetch('/games/activity/word-list-en.json').then(res => res.json())
                ])

                this.wordLists.de = deJson
                this.wordLists.en = enJson

                const writeTx = db.transaction(STORE_NAME, 'readwrite')
                const writeStore = writeTx.objectStore(STORE_NAME)
                await writeStore.put({ key: 'de', data: deJson })
                await writeStore.put({ key: 'en', data: enJson })
                await writeTx.done
            }

            this.isInitialized = true
        },

        getRandomWord(language: 'de' | 'en', difficulties?: string[]): WordEntry | null {
            let list = this.wordLists[language]
          
            if (difficulties && difficulties.length > 0) {
              list = list.filter(entry => difficulties.includes(entry.difficulty))
            }
          
            if (list.length === 0) return null
          
            const randomIndex = Math.floor(Math.random() * list.length)
            return list[randomIndex]
        },
        getAvailableCategories(language: 'de' | 'en'): string[] {
            const list = this.wordLists[language]
            const categories: string[] = []

            list.forEach(entry => {
                if (!categories.includes(entry.category)) {
                    categories.push(entry.category)
                }
            })

            return Array.from(categories)
        },
        }       
    }
)
