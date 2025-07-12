import { defineStore } from 'pinia'
import { openDB } from 'idb'
import { useGameStore } from '@/stores/schnapsidee/gameStore'

const DB_NAME = 'schnapsidee-db'
const STORE_NAME = 'word-list-store'

export type WordEntry = {
    word: string
    forbidden: string[]
    category: string
}

export const useWordListStore = defineStore('wordList', {
    state: () => ({
        wordLists: {
            de: [] as WordEntry[],
            en: [] as WordEntry[],
        },
        recentWords: {
            de: [] as string[],
            en: [] as string[],
        },
        isInitialized: false,
    }),
    persist: true,
    actions: {
        async init() {
            if (this.isInitialized) return;

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
                    fetch('/games/de/schnapsidee/word-list.json').then(res => res.json()),
                    fetch('/games/en/schnapsidee/word-list.json').then(res => res.json())
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
        getRandomWord(language: 'de' | 'en'): WordEntry | null {
            let list = this.wordLists[language]

            const gameStore = useGameStore()
            const wordCategories = gameStore.getAllowedWordLists


            if (wordCategories && wordCategories.length > 0) {
                list = list.filter(entry => wordCategories.includes(entry.category))
            }
          
            if (list.length === 0) return null

            // Define for how long word list entries should be saved
            let recents_length = Math.ceil(list.length * (2/3));
          
            // Get words that aren't in the recent list
            const availableWords = list.filter(entry => !this.recentWords[language].includes(entry.word))
            
            let selectedWord: WordEntry;

            // If we have available words not in the recent list, pick one randomly
            if (availableWords.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableWords.length)
                selectedWord = availableWords[randomIndex]
            } 
            else {
                // Fallback - just pick any random word if all in recents list
                this.recentWords[language] = []
                const randomIndex = Math.floor(Math.random() * list.length)
                selectedWord = list[randomIndex]
            }

            this.addToRecentWords(language, selectedWord.word, recents_length)
            return selectedWord
        },
        // Helper method to manage the recent words list
        addToRecentWords(language: 'de' | 'en', word: string, recents_length: number) {
            this.recentWords[language].push(word)
            if (this.recentWords[language].length > recents_length) {
                this.recentWords[language].shift()
            }
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
