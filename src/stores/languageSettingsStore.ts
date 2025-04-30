import { defineStore } from 'pinia';

export const useLanguageSettingsStore = defineStore('languageSettings', {
    state: () => ({
        language: 'en' as 'en' | 'de',
    }),
    persist: true,
    actions: {
        getLanguage(): 'en' | 'de' {
            return this.language;
        },
        setLanguage(newLanguage: 'en' | 'de'): void {
            if (newLanguage === 'en' || newLanguage === 'de') {
              this.language = newLanguage;
              localStorage.setItem('language', newLanguage);
            } else {
              throw new Error('Invalid language. Only "en" or "de" are allowed.');
            }
          }
          
    },
});
