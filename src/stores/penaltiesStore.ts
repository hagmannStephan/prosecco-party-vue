import { defineStore } from 'pinia';
import { openDB } from 'idb';

const DB_NAME = "prosecco-party-db";
const STORE_NAME = "penalties-store";

export const usePenaltiesStore = defineStore('penalties', {
    state: () => ({
        penalties: {
            de: [] as string[],
            en: [] as string[],
        },
        isInitialized: false,
    }),
    persist: true,
    actions: {
        // Private method
        async init() {
            if (this.isInitialized) return;

            const db = await openDB(DB_NAME, 1, {
                upgrade(db) {
                    if (!db.objectStoreNames.contains(STORE_NAME)) {
                        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
                    }
                },
            });

            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);

            const deData = await store.get('de');
            const enData = await store.get('en');

            if (deData && enData) {
                this.penalties.de = deData.data;
                this.penalties.en = enData.data;
            } else {
                // Fetch from local files if not in DB
                const [deJson, enJson] = await Promise.all([
                    fetch('/games/de/penalty-list.json').then(res => res.json()),
                    fetch('/games/en/penalty-list.json').then(res => res.json())
                ]);

                this.penalties.de = deJson;
                this.penalties.en = enJson;

                const writeTx = db.transaction(STORE_NAME, 'readwrite');
                const writeStore = writeTx.objectStore(STORE_NAME);
                await writeStore.put({ key: 'de', data: deJson });
                await writeStore.put({ key: 'en', data: enJson });
            }

            this.isInitialized = true;
        },
        // Public method
        async getRandomPenaltySelection(language: 'de' | 'en') {
            if (this.isInitialized === false) {
                await this.init();
            }
            const penalties = this.penalties[language];
            if (penalties.length < 3) return penalties;
            const shuffled = [...penalties].sort(() => Math.random() - 0.5);
            return shuffled.slice(0, 3);
        },
    }
})