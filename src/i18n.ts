import { createI18n } from "vue-i18n";

import homeEn from "./locales/en/Home.ts";
import homeDe from "./locales/de/Home.ts";

const messages = {
    en: {
        home: homeEn,
    },
    de: {
        home: homeDe,
    },
};

const i18n = createI18n({
    legacy: false,
    locale: navigator.language,
    fallbackLocale: "en",
    messages,
});

export default i18n;