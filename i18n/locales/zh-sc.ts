import { zhHant } from "vuetify/locale";
import type { i18nSchema } from "./en";

export default defineI18nLocale<i18nSchema>(async () => {
  return {
    helloWorld: "你好",
    $vuetify: zhHant,
    auth: {
      signInWithGoogle: "使用 Google 登录",
      signOut: "登出",
      signedIn: "已登录",
      notSignedIn: "未登录",
      loading: "加载中...",
      verified: "已验证",
      unverified: "未验证",
      anonymousUser: "匿名用户",
      welcomeBack: "欢迎回来",
      signInSuccess: "成功登录！",
      signOutSuccess: "成功登出！",
      error: "验证错误",
    },
  };
});
