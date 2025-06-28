import { en } from "vuetify/locale";

const schema = {
  $vuetify: en,
  helloWorld: "Hello World",
  auth: {
    signInWithGoogle: "Sign in with Google",
    signOut: "Sign Out",
    signedIn: "Signed In",
    notSignedIn: "Not signed in",
    loading: "Loading...",
    verified: "Verified",
    unverified: "Unverified",
    anonymousUser: "Anonymous User",
    welcomeBack: "Welcome back",
    signInSuccess: "Successfully signed in!",
    signOutSuccess: "Successfully signed out!",
    error: "Authentication Error",
  },
};

export type i18nSchema = typeof schema;

export default defineI18nLocale<i18nSchema>(async () => {
  return schema;
});
