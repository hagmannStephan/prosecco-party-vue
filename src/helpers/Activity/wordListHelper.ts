import { useWordListStore, type WordEntry } from '@/stores/activity/wordListStore'
import { useLanguageSettingsStore } from '@/stores/languageSettingsStore'

export function getRandomWord(): WordEntry | string {
    const wordListStore = useWordListStore()
    const languageSettingsStore = useLanguageSettingsStore()
 
    // Make sure store is initialized first
    if (!wordListStore.isInitialized) {
        console.warn('[getRandomWord] Word list store not initialized')
        return 'Loading...'
    }
 
    const language = languageSettingsStore.getLanguage()
    
    // If some case the entires should get filtered by difficulty
    const difficulties = ["easy", "medium", "hard"]
 
    const wordEntry = wordListStore.getRandomWord(language, difficulties)
 
    if (!wordEntry) {
      console.warn('[getRandomWord] No word found:', {
        language,
        difficulties,
        wordList: wordListStore.wordLists[language],
      })
      return 'No matching words found 🤒'
    }
 
    return wordEntry
}

export function getWordListCategories(): string[] {
    // TODO: Don't hardcode this, but check the store for available categories
    return [
        'standard',
        'activity',
        'sport',
        'spicy',
    ]
 }