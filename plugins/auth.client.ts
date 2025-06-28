export default defineNuxtPlugin(async () => {
  // Only run on client side
  if (import.meta.client) {
    const { initAuth } = useAuth();

    // Initialize Firebase Auth state listener
    initAuth();
  }
});
