import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, type User } from "firebase/auth";
import type { AuthUser, AuthState, GoogleSignInResult, SignOutResult } from "~/types/auth";
import { mapFirebaseUser } from "~/types/auth";

export const useAuth = () => {
  const user = ref<AuthUser | null>(null);
  const isAuthenticated = computed(() => !!user.value);
  const isLoading = ref(true);
  const error = ref<string | null>(null);

  const handleError = (err: unknown): string => {
    console.error("Auth error:", err);

    if (err && typeof err === "object") {
      if ("code" in err && typeof err.code === "string") {
        // Firebase Auth error codes
        switch (err.code) {
          case "auth/popup-closed-by-user":
            return "Sign-in was cancelled by user";
          case "auth/popup-blocked":
            return "Sign-in popup was blocked by browser";
          case "auth/cancelled-popup-request":
            return "Sign-in was cancelled";
          case "auth/network-request-failed":
            return "Network error. Please check your connection";
          case "auth/too-many-requests":
            return "Too many attempts. Please try again later";
          case "auth/user-disabled":
            return "This account has been disabled";
          case "auth/operation-not-allowed":
            return "Google sign-in is not enabled";
          default:
            return `Authentication error: ${err.code}`;
        }
      }
      if ("message" in err && typeof err.message === "string") {
        return err.message;
      }
    }
    return "An unexpected authentication error occurred";
  };

  // Initialize auth state listener
  const initAuth = () => {
    const auth = getAuth();

    onAuthStateChanged(
      auth,
      (firebaseUser: User | null) => {
        user.value = mapFirebaseUser(firebaseUser);
        isLoading.value = false;
      },
      authError => {
        console.error("Auth state change error:", authError);
        error.value = handleError(authError);
        isLoading.value = false;
      },
    );
  };

  // Sign in with Google
  const signInWithGoogle = async (): Promise<GoogleSignInResult> => {
    isLoading.value = true;
    error.value = null;

    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();

      // Optional: Add scopes if needed
      provider.addScope("email");
      provider.addScope("profile");

      const result = await signInWithPopup(auth, provider);
      const authUser = mapFirebaseUser(result.user);

      user.value = authUser;

      return {
        user: authUser,
        error: null,
      };
    } catch (err) {
      const errorMessage = handleError(err);
      error.value = errorMessage;

      return {
        user: null,
        error: errorMessage,
      };
    } finally {
      isLoading.value = false;
    }
  };

  // Sign out
  const signOutUser = async (): Promise<SignOutResult> => {
    isLoading.value = true;
    error.value = null;

    try {
      const auth = getAuth();
      await signOut(auth);

      user.value = null;

      return {
        success: true,
        error: null,
      };
    } catch (err) {
      const errorMessage = handleError(err);
      error.value = errorMessage;

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      isLoading.value = false;
    }
  };

  // Get current auth state
  const getAuthState = (): AuthState => ({
    user: user.value,
    isAuthenticated: isAuthenticated.value,
    isLoading: isLoading.value,
    error: error.value,
  });

  // Clear error
  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Methods
    initAuth,
    signInWithGoogle,
    signOutUser,
    getAuthState,
    clearError,
  };
};
