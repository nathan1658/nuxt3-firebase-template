export default defineNuxtRouteMiddleware(to => {
  const { isAuthenticated, isLoading } = useAuth();

  // Wait for auth to initialize on client side
  if (import.meta.client && isLoading.value) {
    return;
  }

  // Check if user is authenticated
  if (!isAuthenticated.value) {
    // Store the intended destination
    const redirectTo = encodeURIComponent(to.fullPath);

    // Redirect to auth page with return URL
    return navigateTo(`/auth?redirect=${redirectTo}`);
  }
});
