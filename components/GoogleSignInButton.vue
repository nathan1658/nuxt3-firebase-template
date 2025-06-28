<template>
  <VBtn
    :loading="isLoading"
    :disabled="isLoading || isAuthenticated"
    color="primary"
    variant="outlined"
    prepend-icon="mdi-google"
    size="large"
    @click="handleSignIn"
  >
    <template #prepend>
      <VIcon color="red" />
    </template>
    {{ isAuthenticated ? $t("auth.signedIn") : $t("auth.signInWithGoogle") }}
  </VBtn>
</template>

<script setup lang="ts">
import type { AuthUser } from "~/types/auth";

interface Props {
  redirectTo?: string;
  showSuccessMessage?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  redirectTo: "/",
  showSuccessMessage: true,
});

const emit = defineEmits<{
  success: [user: AuthUser];
  error: [error: string];
}>();

const { signInWithGoogle, isLoading, isAuthenticated, error } = useAuth();
const router = useRouter();
const { $t } = useI18n();

const handleSignIn = async () => {
  const result = await signInWithGoogle();

  if (result.user) {
    emit("success", result.user);

    if (props.showSuccessMessage) {
      // You can add a toast notification here if available
      console.log("Successfully signed in with Google");
    }

    // Redirect after successful sign in
    await router.push(props.redirectTo);
  } else if (result.error) {
    emit("error", result.error);
  }
};

// Watch for global auth errors
watch(error, newError => {
  if (newError) {
    emit("error", newError);
  }
});
</script>

<style scoped>
.v-btn :deep(.v-icon) {
  margin-right: 8px;
}
</style>
