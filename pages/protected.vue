<template>
  <VContainer>
    <VRow justify="center">
      <VCol
        cols="12"
        md="8"
      >
        <VCard>
          <VCardTitle class="d-flex align-center">
            <VIcon
              icon="mdi-shield-check"
              color="success"
              class="me-2"
            />
            Protected Area
          </VCardTitle>

          <VCardText>
            <VAlert
              type="success"
              variant="tonal"
              class="mb-4"
            >
              <VIcon
                icon="mdi-check-circle"
                class="me-2"
              />
              You are successfully authenticated! This page requires login to access.
            </VAlert>

            <p class="text-h6 mb-3">Welcome, {{ user?.displayName || user?.email }}!</p>

            <p class="text-body-1 mb-4">
              This is a protected page that demonstrates authentication middleware. Only authenticated users can access
              this content.
            </p>

            <!-- User Details Card -->
            <VCard
              variant="outlined"
              class="mb-4"
            >
              <VCardTitle class="text-h6">
                <VIcon
                  icon="mdi-account-details"
                  class="me-2"
                />
                Your Profile
              </VCardTitle>
              <VCardText>
                <VRow>
                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VList>
                      <VListItem>
                        <VListItemTitle>User ID</VListItemTitle>
                        <VListItemSubtitle>{{ user?.uid }}</VListItemSubtitle>
                      </VListItem>

                      <VListItem>
                        <VListItemTitle>Email</VListItemTitle>
                        <VListItemSubtitle>{{ user?.email || "Not provided" }}</VListItemSubtitle>
                      </VListItem>

                      <VListItem>
                        <VListItemTitle>Display Name</VListItemTitle>
                        <VListItemSubtitle>{{ user?.displayName || "Not provided" }}</VListItemSubtitle>
                      </VListItem>
                    </VList>
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VList>
                      <VListItem>
                        <VListItemTitle>Email Verified</VListItemTitle>
                        <VListItemSubtitle>
                          <VChip
                            :color="user?.emailVerified ? 'success' : 'warning'"
                            size="small"
                            variant="tonal"
                          >
                            {{ user?.emailVerified ? "Yes" : "No" }}
                          </VChip>
                        </VListItemSubtitle>
                      </VListItem>

                      <VListItem>
                        <VListItemTitle>Provider</VListItemTitle>
                        <VListItemSubtitle>{{ user?.providerId || "Unknown" }}</VListItemSubtitle>
                      </VListItem>

                      <VListItem v-if="user?.photoURL">
                        <VListItemTitle>Profile Photo</VListItemTitle>
                        <VListItemSubtitle>
                          <VAvatar
                            :image="user.photoURL"
                            size="small"
                          />
                        </VListItemSubtitle>
                      </VListItem>
                    </VList>
                  </VCol>
                </VRow>
              </VCardText>
            </VCard>

            <!-- Actions -->
            <div class="d-flex gap-2 flex-wrap">
              <VBtn
                color="primary"
                variant="outlined"
                prepend-icon="mdi-home"
                @click="$router.push('/')"
              >
                Go Home
              </VBtn>

              <VBtn
                color="secondary"
                variant="outlined"
                prepend-icon="mdi-firebase"
                @click="$router.push('/auth')"
              >
                Auth Demo
              </VBtn>

              <AuthUserCard :show-sign-in-button="false" />
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
// This page requires authentication
definePageMeta({
  middleware: "auth",
});

// SEO
useSeoMeta({
  title: "Protected Area",
  description: "A protected page that requires authentication to access",
});

useHead({
  title: "Protected Area - Authentication Required",
});

const { user } = useAuth();
</script>

<style scoped>
.d-flex.gap-2 {
  gap: 8px;
}
</style>
