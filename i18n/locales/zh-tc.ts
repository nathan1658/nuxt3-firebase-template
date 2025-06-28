import { zhHant } from "vuetify/locale";
import type { i18nSchema } from "./en";

export default defineI18nLocale<i18nSchema>(async () => {
  return {
    helloWorld: "你好",
    $vuetify: zhHant,
    auth: {
      signInWithGoogle: "使用 Google 登入",
      signOut: "登出",
      signedIn: "已登入",
      notSignedIn: "未登入",
      loading: "載入中...",
      verified: "已驗證",
      unverified: "未驗證",
      anonymousUser: "匿名用戶",
      welcomeBack: "歡迎回來",
      signInSuccess: "成功登入！",
      signOutSuccess: "成功登出！",
      error: "驗證錯誤",
    },
  };
});
