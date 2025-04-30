import { useWordListStore, type WordEntry } from '@/stores/activity/wordListStore'
import { useLanguageSettingsStore } from '@/stores/languageSettingsStore'
import { useGameStore } from '@/stores/activity/settingsStore'

export function getRandomWord(): WordEntry | string {
    const wordListStore = useWordListStore()
    const languageSettingsStore = useLanguageSettingsStore()
    const gameStore = useGameStore()
  
    const language = languageSettingsStore.getLanguage()
    const difficulties = gameStore.getGameModes
  
    const wordEntry = wordListStore.getRandomWord(language, difficulties)
  
    if (!wordEntry) {
      console.warn('[getRandomWord] No word found:', {
        language,
        difficulties,
        wordList: wordListStore.wordLists[language],
      })
      return 'Something went wrong 🤒'
    }
  
    return wordEntry
}