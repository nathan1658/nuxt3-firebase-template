<template>
  <VContainer>
    <ClientOnly><LanguageSelectBox /></ClientOnly>

    <VRow
      justify="center"
      class="mt-8"
    >
      <VCol
        cols="12"
        md="8"
        lg="6"
      >
        <VCard>
          <VCardTitle class="text-h4 text-center pa-6">
            <VIcon
              icon="mdi-firebase"
              color="orange"
              class="me-2"
            />
            {{ $t("auth.signInWithGoogle") }}
          </VCardTitle>

          <VCardText>
            <div class="text-center mb-6">
              <p class="text-h6 mb-4">Firebase Authentication Demo</p>
              <p class="text-body-1 text-medium-emphasis">
                This demonstrates Google Sign-In integration with Firebase Auth in Nuxt 3.
              </p>
            </div>

            <!-- Auth User Card -->
            <AuthUserCard
              :show-sign-in-button="true"
              redirect-after-sign-out="/auth"
              @sign-in-success="handleSignInSuccess"
              @sign-in-error="handleSignInError"
              @sign-out-success="handleSignOutSuccess"
              @sign-out-error="handleSignOutError"
            />

            <!-- Error Display -->
            <VAlert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              class="mt-4"
              closable
              @click:close="errorMessage = null"
            >
              {{ errorMessage }}
            </VAlert>

            <!-- Success Display -->
            <VAlert
              v-if="successMessage"
              type="success"
              variant="tonal"
              class="mt-4"
              closable
              @click:close="successMessage = null"
            >
              {{ successMessage }}
            </VAlert>

            <!-- Auth State Info -->
            <VCard
              v-if="user"
              variant="outlined"
              class="mt-6"
            >
              <VCardTitle class="text-h6">
                <VIcon
                  icon="mdi-information"
                  class="me-2"
                />
                User Information
              </VCardTitle>
              <VCardText>
                <pre class="text-caption">{{ JSON.stringify(authState, null, 2) }}</pre>
              </VCardText>
            </VCard>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import type { AuthUser } from "~/types/auth";

// SEO
useSeoMeta({
  title: "Firebase Auth Demo",
  description: "Google Sign-In with Firebase Authentication demo page",
});

useHead({
  title: "Firebase Auth Demo",
});

const { user, getAuthState } = useAuth();
const { $t } = useI18n();
const route = useRoute();
const router = useRouter();

const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const authState = computed(() => getAuthState());

// Get redirect URL from query params
const redirectTo = computed(() => {
  const redirect = route.query.redirect;
  return typeof redirect === "string" ? decodeURIComponent(redirect) : "/";
});

const handleSignInSuccess = (user: AuthUser) => {
  successMessage.value = $t("auth.signInSuccess");
  errorMessage.value = null;
  console.log("Sign in successful:", user);

  // Redirect to intended destination
  setTimeout(() => {
    router.push(redirectTo.value);
  }, 1000);
};

const handleSignInError = (error: string) => {
  errorMessage.value = error;
  successMessage.value = null;
  console.error("Sign in error:", error);
};

const handleSignOutSuccess = () => {
  successMessage.value = $t("auth.signOutSuccess");
  errorMessage.value = null;
  console.log("Sign out successful");
};

const handleSignOutError = (error: string) => {
  errorMessage.value = error;
  successMessage.value = null;
  console.error("Sign out error:", error);
};

// Auto-clear messages after 5 seconds
watch(successMessage, newMessage => {
  if (newMessage) {
    setTimeout(() => {
      successMessage.value = null;
    }, 5000);
  }
});

watch(errorMessage, newMessage => {
  if (newMessage) {
    setTimeout(() => {
      errorMessage.value = null;
    }, 10000);
  }
});
</script>

<style scoped>
pre {
  background-color: rgb(var(--v-theme-surface-variant));
  padding: 16px;
  border-radius: 4px;
  font-size: 12px;
  overflow-x: auto;
}
</style>
