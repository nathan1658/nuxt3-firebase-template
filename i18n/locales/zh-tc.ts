import { zhHant } from "vuetify/locale";
import type { i18nSchema } from "./en";

export default defineI18nLocale<i18nSchema>(async () => {
  return {
    helloWorld: "你好",
    $vuetify: zhHant,
  };
});
