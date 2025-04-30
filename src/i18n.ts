import { createI18n } from "vue-i18n";

import homeEn from "./locales/en/Home.ts";
import homeDe from "./locales/de/Home.ts";
import ActivityConfigEn from "./locales/en/games/activity/ActivityConfig.ts";
import ActivityConfigDe from "./locales/de/games/activity/ActivityConfig.ts";
import ActivityBreakEn from "./locales/en/games/activity/ActivityBreak.ts";
import ActivityBreakDe from "./locales/de/games/activity/ActivityBreak.ts";
import ActivityGameEn from "./locales/en/games/activity/ActivityGame.ts";
import ActivityGameDe from "./locales/de/games/activity/ActivityGame.ts";

const savedLocale = localStorage.getItem('language') || 'en';

const messages = {
    en: {
        home: homeEn,
        activity: {
            config: ActivityConfigEn,
            break: ActivityBreakEn,
            game: ActivityGameEn,
        }
    },
    de: {
        home: homeDe,
        activity: {
            config: ActivityConfigDe,
            break: ActivityBreakDe,
            game: ActivityGameDe,
        }
    },
};

const i18n = createI18n({
    legacy: false,
    locale: savedLocale,
    fallbackLocale: "en",
    messages,
});

export default i18n;