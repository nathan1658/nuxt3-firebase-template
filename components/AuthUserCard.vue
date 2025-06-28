<template>
  <VCard
    v-if="isAuthenticated && user"
    class="auth-user-card"
  >
    <VCardText>
      <div class="d-flex align-center">
        <VAvatar
          :image="user.photoURL || undefined"
          color="primary"
          class="me-4"
        >
          <VIcon
            v-if="!user.photoURL"
            icon="mdi-account"
          />
        </VAvatar>

        <div class="flex-grow-1">
          <div class="text-h6">
            {{ user.displayName || user.email || $t("auth.anonymousUser") }}
          </div>
          <div
            v-if="user.email"
            class="text-caption text-medium-emphasis"
          >
            {{ user.email }}
          </div>
          <div class="text-caption">
            <VChip
              :color="user.emailVerified ? 'success' : 'warning'"
              size="x-small"
              variant="tonal"
            >
              {{ user.emailVerified ? $t("auth.verified") : $t("auth.unverified") }}
            </VChip>
          </div>
        </div>

        <VBtn
          :loading="isLoading"
          color="error"
          variant="outlined"
          size="small"
          @click="handleSignOut"
        >
          {{ $t("auth.signOut") }}
        </VBtn>
      </div>
    </VCardText>
  </VCard>

  <VCard
    v-else-if="!isAuthenticated && !isLoading"
    class="auth-user-card"
  >
    <VCardText class="text-center">
      <VIcon
        icon="mdi-account-off"
        size="48"
        class="mb-4 text-medium-emphasis"
      />
      <div class="text-h6 mb-2">{{ $t("auth.notSignedIn") }}</div>
      <GoogleSignInButton
        :show-success-message="false"
        @success="handleSignInSuccess"
        @error="handleSignInError"
      />
    </VCardText>
  </VCard>

  <VCard
    v-else
    class="auth-user-card"
  >
    <VCardText class="text-center">
      <VProgressCircular indeterminate />
      <div class="mt-2">{{ $t("auth.loading") }}</div>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import type { AuthUser } from "~/types/auth";

interface Props {
  showSignInButton?: boolean;
  redirectAfterSignOut?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showSignInButton: true,
  redirectAfterSignOut: "/",
});

const emit = defineEmits<{
  signInSuccess: [user: AuthUser];
  signInError: [error: string];
  signOutSuccess: [];
  signOutError: [error: string];
}>();

const { user, isAuthenticated, isLoading, signOutUser } = useAuth();
const router = useRouter();
const { $t } = useI18n();

const handleSignOut = async () => {
  const result = await signOutUser();

  if (result.success) {
    emit("signOutSuccess");
    console.log("Successfully signed out");

    // Redirect after sign out
    if (props.redirectAfterSignOut) {
      await router.push(props.redirectAfterSignOut);
    }
  } else if (result.error) {
    emit("signOutError", result.error);
    console.error("Sign out error:", result.error);
  }
};

const handleSignInSuccess = (user: AuthUser) => {
  emit("signInSuccess", user);
};

const handleSignInError = (error: string) => {
  emit("signInError", error);
};
</script>

<style scoped>
.auth-user-card {
  max-width: 400px;
}
</style>
