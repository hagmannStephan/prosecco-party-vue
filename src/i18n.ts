import { createI18n } from "vue-i18n";

import homeEn from "./locales/en/Home.ts";
import homeDe from "./locales/de/Home.ts";
import SchnapsideeConfigEn from "./locales/en/games/schnapsidee/SchnapsideeConfig.ts";
import SchnapsideeConfigDe from "./locales/de/games/schnapsidee/SchnapsideeConfig.ts";
import SchnapsideeBreakEn from "./locales/en/games/schnapsidee/SchnapsideeBreak.ts";
import SchnapsideeBreakDe from "./locales/de/games/schnapsidee/SchnapsideeBreak.ts";
import SchnapsideeGameEn from "./locales/en/games/schnapsidee/SchnapsideeGame.ts";
import SchnapsideeGameDe from "./locales/de/games/schnapsidee/SchnapsideeGame.ts";
import SchnapsideeTimeUpEn from "./locales/en/games/schnapsidee/SchnapsideeTimeUp.ts";
import SchnapsideeTimeUpDe from "./locales/de/games/schnapsidee/SchnapsideeTimeUp.ts";
import SchnapsideeDoneEn from "./locales/en/games/schnapsidee/SchnapsideeDone.ts";
import SchnapsideeDoneDe from "./locales/de/games/schnapsidee/SchnapsideeDone.ts";
import SchnapsideeRankedEn from "./locales/en/games/schnapsidee/SchnapsideeRanked.ts";
import SchnapsideeRankedDe from "./locales/de/games/schnapsidee/SchnapsideeRanked.ts";

const savedLocale = localStorage.getItem('language') || 'en';

const messages = {
    en: {
        home: homeEn,
        schnapsidee: {
            config: SchnapsideeConfigEn,
            break: SchnapsideeBreakEn,
            game: SchnapsideeGameEn,
            timeUp: SchnapsideeTimeUpEn,
            done: SchnapsideeDoneEn,
            ranked: SchnapsideeRankedEn,
        }
    },
    de: {
        home: homeDe,
        schnapsidee: {
            config: SchnapsideeConfigDe,
            break: SchnapsideeBreakDe,
            game: SchnapsideeGameDe,
            timeUp: SchnapsideeTimeUpDe,
            done: SchnapsideeDoneDe,
            ranked: SchnapsideeRankedDe,
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