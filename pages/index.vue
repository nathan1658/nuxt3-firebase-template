<template>
  <VContainer>
    <ClientOnly><LanguageSelectBox /></ClientOnly>

    <!-- Welcome section with auth status -->
    <VRow class="mb-6">
      <VCol cols="12">
        <BaseCard>
          <div class="d-flex justify-space-between align-center flex-wrap">
            <div>
              <h1 class="text-h4 mb-2">{{ $t("helloWorld") }}</h1>
              <p class="text-body-1 text-medium-emphasis">Nuxt 3 Firebase Template with Google Authentication</p>
            </div>

            <!-- Compact Auth Status -->
            <div class="auth-status">
              <template v-if="isAuthenticated && user">
                <VChip
                  color="success"
                  variant="tonal"
                  prepend-icon="mdi-check-circle"
                  class="me-2"
                >
                  {{ $t("auth.signedIn") }}
                </VChip>
                <VAvatar
                  :image="user.photoURL || undefined"
                  size="small"
                  color="primary"
                >
                  <VIcon
                    v-if="!user.photoURL"
                    icon="mdi-account"
                  />
                </VAvatar>
              </template>

              <template v-else-if="!isLoading">
                <VChip
                  color="warning"
                  variant="tonal"
                  prepend-icon="mdi-account-off"
                >
                  {{ $t("auth.notSignedIn") }}
                </VChip>
              </template>

              <template v-else>
                <VProgressCircular
                  size="24"
                  indeterminate
                />
              </template>
            </div>
          </div>
        </BaseCard>
      </VCol>
    </VRow>

    <!-- Navigation Cards -->
    <VRow class="mb-6">
      <VCol
        cols="12"
        md="4"
      >
        <VCard
          hover
          class="h-100"
          @click="$router.push('/auth')"
        >
          <VCardTitle class="d-flex align-center">
            <VIcon
              icon="mdi-firebase"
              color="orange"
              class="me-2"
            />
            Firebase Authentication
          </VCardTitle>
          <VCardText>
            <p>Test Google Sign-In with Firebase Authentication. View user profile and manage authentication state.</p>
            <VBtn
              color="primary"
              variant="outlined"
              class="mt-3"
              @click.stop="$router.push('/auth')"
            >
              Try Auth Demo
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>

      <VCol
        cols="12"
        md="4"
      >
        <VCard
          hover
          class="h-100"
          @click="$router.push('/protected')"
        >
          <VCardTitle class="d-flex align-center">
            <VIcon
              icon="mdi-shield-check"
              color="success"
              class="me-2"
            />
            Protected Area
          </VCardTitle>
          <VCardText>
            <p>Access a protected page that requires authentication. Test the auth middleware functionality.</p>
            <VBtn
              color="success"
              variant="outlined"
              class="mt-3"
              @click.stop="$router.push('/protected')"
            >
              Enter Protected Area
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>

      <VCol
        cols="12"
        md="4"
      >
        <VCard
          hover
          class="h-100"
          @click="$router.push('/persons')"
        >
          <VCardTitle class="d-flex align-center">
            <VIcon
              icon="mdi-database"
              color="green"
              class="me-2"
            />
            Database Demo
          </VCardTitle>
          <VCardText>
            <p>Explore the existing person management system with MongoDB integration and CRUD operations.</p>
            <VBtn
              color="primary"
              variant="outlined"
              class="mt-3"
              @click.stop="$router.push('/persons')"
            >
              View Persons
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Firestore Demo -->
    <VRow>
      <VCol cols="12">
        <BaseCard>
          <h2 class="text-h5 mb-4">
            <VIcon
              icon="mdi-fire"
              color="orange"
              class="me-2"
            />
            Firestore Connection Test
          </h2>

          <div class="mb-4">{{ t }}</div>
          <VBtn
            variant="outlined"
            class="me-2"
            @click="refresh"
          >
            Fetch API Data
          </VBtn>

          <div class="mt-4">
            <h3 class="text-h6 mb-2">Firestore Todos:</h3>
            <VList v-if="todos && todos.length > 0">
              <VListItem
                v-for="todo in todos"
                :key="todo.id"
              >
                <VListItemTitle>{{ todo.text }}</VListItemTitle>
              </VListItem>
            </VList>
            <VAlert
              v-else
              type="info"
              variant="tonal"
            >
              No todos found. Add some data to the 'todos' collection in Firestore to see them here.
            </VAlert>
          </div>
        </BaseCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { useCollection } from "vuefire";
import { collection, getFirestore } from "firebase/firestore";

// SEO
useSeoMeta({
  title: "Nuxt 3 Firebase Template",
  description: "A Nuxt 3 template with Firebase, Google Authentication, and multiple database integrations",
});

const db = getFirestore();
const todos = useCollection(collection(db, "todos"));
const { data: t, refresh } = useAsyncData("the", () => $fetch("/api"));

// Auth composable
const { user, isAuthenticated, isLoading } = useAuth();
const { $t } = useI18n();
</script>

<style scoped>
.auth-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.v-card {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.v-card:hover {
  transform: translateY(-2px);
}

@media (max-width: 960px) {
  .auth-status {
    margin-top: 16px;
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
