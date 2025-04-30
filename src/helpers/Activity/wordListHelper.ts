import { useWordListStore } from '@/stores/activity/wordListStore'
import { useLanguageSettingsStore } from '@/stores/languageSettingsStore'
import { useGameStore } from '@/stores/activity/settingsStore'

export function getRandomWord() {
    const wordListStore = useWordListStore()
    const languageSettingsStore = useLanguageSettingsStore()
    const gameStore = useGameStore()

    const language = languageSettingsStore.getLanguage()
    const difficulties = gameStore.getGameModes

    return wordListStore.getRandomWord(language, difficulties)
}