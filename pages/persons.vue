<template>
  <VContainer fluid>
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardTitle class="d-flex align-center pa-4">
            <VIcon
              icon="mdi-account-group"
              class="me-2"
            />
            Person Management
            <VSpacer />
            <VBtn
              color="primary"
              prepend-icon="mdi-plus"
              @click="openCreateDialog"
            >
              Add Person
            </VBtn>
          </VCardTitle>

          <VCardText>
            <!-- Search and Filter Section -->
            <VRow class="mb-4">
              <VCol
                cols="12"
                md="4"
              >
                <VTextField
                  v-model="searchTerm"
                  :loading="searchLoading"
                  label="Search persons..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="comfortable"
                  clearable
                  @input="handleSearch"
                />
              </VCol>

              <VCol
                cols="12"
                md="2"
              >
                <VSelect
                  v-model="filters.isActive"
                  :items="statusOptions"
                  label="Status"
                  variant="outlined"
                  density="comfortable"
                  clearable
                  @update:model-value="loadPersons"
                />
              </VCol>

              <VCol
                cols="12"
                md="2"
              >
                <VSelect
                  v-model="filters.department"
                  :items="departments"
                  label="Department"
                  variant="outlined"
                  density="comfortable"
                  clearable
                  @update:model-value="loadPersons"
                />
              </VCol>

              <VCol
                cols="12"
                md="2"
              >
                <VSelect
                  v-model="pagination.limit"
                  :items="[10, 25, 50, 100]"
                  label="Per Page"
                  variant="outlined"
                  density="comfortable"
                  @update:model-value="loadPersons"
                />
              </VCol>

              <VCol
                cols="12"
                md="2"
              >
                <VBtn
                  variant="outlined"
                  prepend-icon="mdi-refresh"
                  @click="refreshData"
                >
                  Refresh
                </VBtn>
              </VCol>
            </VRow>

            <!-- Statistics Cards -->
            <VRow
              v-if="stats"
              class="mb-4"
            >
              <VCol
                cols="6"
                md="3"
              >
                <VCard
                  color="primary"
                  variant="tonal"
                >
                  <VCardText class="text-center">
                    <div class="text-h4 font-weight-bold">{{ stats.total }}</div>
                    <div class="text-subtitle-1">Total Persons</div>
                  </VCardText>
                </VCard>
              </VCol>

              <VCol
                cols="6"
                md="3"
              >
                <VCard
                  color="success"
                  variant="tonal"
                >
                  <VCardText class="text-center">
                    <div class="text-h4 font-weight-bold">{{ stats.active }}</div>
                    <div class="text-subtitle-1">Active</div>
                  </VCardText>
                </VCard>
              </VCol>

              <VCol
                cols="6"
                md="3"
              >
                <VCard
                  color="warning"
                  variant="tonal"
                >
                  <VCardText class="text-center">
                    <div class="text-h4 font-weight-bold">{{ stats.inactive }}</div>
                    <div class="text-subtitle-1">Inactive</div>
                  </VCardText>
                </VCard>
              </VCol>

              <VCol
                cols="6"
                md="3"
              >
                <VCard
                  color="info"
                  variant="tonal"
                >
                  <VCardText class="text-center">
                    <div class="text-h4 font-weight-bold">{{ Math.round(stats.averageAge) }}</div>
                    <div class="text-subtitle-1">Avg Age</div>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>

            <!-- Data Table -->
            <VDataTableServer
              v-model:items-per-page="pagination.limit"
              v-model:page="pagination.page"
              :headers="headers"
              :items="persons"
              :items-length="pagination.total"
              :loading="loading"
              :search="searchTerm"
              class="elevation-1"
              @update:options="handleTableUpdate"
            >
              <template #item.isActive="{ item }">
                <VChip
                  :color="item.isActive ? 'success' : 'warning'"
                  size="small"
                  label
                >
                  {{ item.isActive ? "Active" : "Inactive" }}
                </VChip>
              </template>

              <template #item.age="{ item }">{{ item.age }} years</template>

              <template #item.salary="{ item }">
                <span v-if="item.salary">${{ item.salary.toLocaleString() }}</span>
                <span
                  v-else
                  class="text-grey"
                >
                  -
                </span>
              </template>

              <template #item.hireDate="{ item }">
                <span v-if="item.hireDate">
                  {{ formatDate(item.hireDate) }}
                </span>
                <span
                  v-else
                  class="text-grey"
                >
                  -
                </span>
              </template>

              <template #item.actions="{ item }">
                <VBtn
                  icon="mdi-eye"
                  size="small"
                  variant="text"
                  @click="viewPerson(item)"
                />
                <VBtn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  @click="editPerson(item)"
                />
                <VBtn
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  @click="confirmDelete(item)"
                />
              </template>

              <template #no-data>
                <div class="text-center pa-4">
                  <VIcon
                    size="64"
                    color="grey-lighten-1"
                  >
                    mdi-account-off
                  </VIcon>
                  <div class="text-h6 mt-2">No persons found</div>
                  <div class="text-body-2 text-grey">Try adjusting your search or filters</div>
                </div>
              </template>
            </VDataTableServer>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- CRUD Dialog -->
    <PersonCrudDialog
      v-model="dialog.show"
      :person="dialog.person"
      @success="handlePersonUpdate"
    />

    <!-- View Dialog -->
    <VDialog
      v-model="viewDialog"
      max-width="500px"
    >
      <VCard v-if="selectedPerson">
        <VCardTitle class="text-h5">{{ selectedPerson.firstName }} {{ selectedPerson.lastName }}</VCardTitle>

        <VCardText>
          <VContainer>
            <VRow>
              <VCol cols="6"><strong>Email:</strong></VCol>
              <VCol cols="6">{{ selectedPerson.email }}</VCol>

              <VCol cols="6"><strong>Age:</strong></VCol>
              <VCol cols="6">{{ selectedPerson.age }} years</VCol>

              <VCol
                v-if="selectedPerson.phone"
                cols="6"
              >
                <strong>Phone:</strong>
              </VCol>
              <VCol
                v-if="selectedPerson.phone"
                cols="6"
              >
                {{ selectedPerson.phone }}
              </VCol>

              <VCol
                v-if="selectedPerson.department"
                cols="6"
              >
                <strong>Department:</strong>
              </VCol>
              <VCol
                v-if="selectedPerson.department"
                cols="6"
              >
                {{ selectedPerson.department }}
              </VCol>

              <VCol
                v-if="selectedPerson.position"
                cols="6"
              >
                <strong>Position:</strong>
              </VCol>
              <VCol
                v-if="selectedPerson.position"
                cols="6"
              >
                {{ selectedPerson.position }}
              </VCol>

              <VCol
                v-if="selectedPerson.salary"
                cols="6"
              >
                <strong>Salary:</strong>
              </VCol>
              <VCol
                v-if="selectedPerson.salary"
                cols="6"
              >
                ${{ selectedPerson.salary.toLocaleString() }}
              </VCol>

              <VCol
                v-if="selectedPerson.hireDate"
                cols="6"
              >
                <strong>Hire Date:</strong>
              </VCol>
              <VCol
                v-if="selectedPerson.hireDate"
                cols="6"
              >
                {{ formatDate(selectedPerson.hireDate) }}
              </VCol>

              <VCol cols="6"><strong>Status:</strong></VCol>
              <VCol cols="6">
                <VChip
                  :color="selectedPerson.isActive ? 'success' : 'warning'"
                  size="small"
                  label
                >
                  {{ selectedPerson.isActive ? "Active" : "Inactive" }}
                </VChip>
              </VCol>

              <VCol
                v-if="selectedPerson.address"
                cols="12"
              >
                <strong>Address:</strong>
                <br />
                {{ selectedPerson.address }}
              </VCol>
            </VRow>
          </VContainer>
        </VCardText>

        <VCardActions>
          <VSpacer />
          <VBtn
            color="primary"
            @click="viewDialog = false"
          >
            Close
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Delete Confirmation Dialog -->
    <VDialog
      v-model="deleteDialog"
      max-width="400px"
    >
      <VCard>
        <VCardTitle class="text-h5">Confirm Delete</VCardTitle>

        <VCardText>
          Are you sure you want to delete
          <strong>{{ personToDelete?.firstName }} {{ personToDelete?.lastName }}</strong>
          ?

          <VCheckbox
            v-model="softDelete"
            label="Soft delete (deactivate instead of permanent delete)"
            class="mt-2"
          />
        </VCardText>

        <VCardActions>
          <VSpacer />
          <VBtn
            color="grey-darken-1"
            variant="text"
            @click="deleteDialog = false"
          >
            Cancel
          </VBtn>
          <VBtn
            :loading="deleteLoading"
            color="error"
            variant="elevated"
            @click="handleDelete"
          >
            Delete
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Snackbar for notifications -->
    <VSnackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.message }}
      <template #actions>
        <VBtn
          color="white"
          variant="text"
          @click="snackbar.show = false"
        >
          Close
        </VBtn>
      </template>
    </VSnackbar>
  </VContainer>
</template>

<script setup lang="ts">
import type { Person, PersonQuery } from "~/server/schemas/person.schema";
import PersonCrudDialog from "~/components/PersonCrudDialog.vue";

const { getPersons, deletePerson, searchPersons, getPersonStats, loading, error } = usePerson();

// Page state
const persons = ref<Person[]>([]);
const stats = ref<{ total: number; active: number; inactive: number; averageAge: number } | null>(null);
const searchTerm = ref("");
const searchLoading = ref(false);
const deleteLoading = ref(false);

// Pagination
const pagination = ref({
  page: 1,
  limit: 25,
  total: 0,
  totalPages: 0,
});

// Filters
const filters = ref<Partial<PersonQuery>>({
  isActive: undefined,
  department: undefined,
});

// Dialog states
const dialog = ref({
  show: false,
  person: null as Person | null,
});

const viewDialog = ref(false);
const selectedPerson = ref<Person | null>(null);

const deleteDialog = ref(false);
const personToDelete = ref<Person | null>(null);
const softDelete = ref(true);

// Snackbar
const snackbar = ref({
  show: false,
  message: "",
  color: "success",
});

// Table configuration
const headers = [
  { title: "Name", key: "firstName", sortable: true },
  { title: "Last Name", key: "lastName", sortable: true },
  { title: "Email", key: "email", sortable: true },
  { title: "Age", key: "age", sortable: true },
  { title: "Department", key: "department", sortable: true },
  { title: "Position", key: "position", sortable: true },
  { title: "Salary", key: "salary", sortable: true },
  { title: "Hire Date", key: "hireDate", sortable: true },
  { title: "Status", key: "isActive", sortable: true },
  { title: "Actions", key: "actions", sortable: false, width: "120px" },
];

// Options
const statusOptions = [
  { title: "Active", value: true },
  { title: "Inactive", value: false },
];

const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations"];

// Methods
const loadPersons = async () => {
  const query: PersonQuery = {
    page: pagination.value.page,
    limit: pagination.value.limit,
    sortBy: "createdAt",
    sortOrder: "desc",
    ...filters.value,
  };

  const result = await getPersons(query);
  if (result) {
    persons.value = result.data;
    pagination.value = result.pagination;
  }
};

const loadStats = async () => {
  const result = await getPersonStats();
  if (result) {
    stats.value = result;
  }
};

const handleSearch = useDebounceFn(async () => {
  if (!searchTerm.value.trim()) {
    loadPersons();
    return;
  }

  searchLoading.value = true;
  const result = await searchPersons(searchTerm.value);
  if (result) {
    persons.value = result;
    pagination.value.total = result.length;
  }
  searchLoading.value = false;
}, 500);

const handleTableUpdate = (options: { page: number; itemsPerPage: number }) => {
  pagination.value.page = options.page;
  pagination.value.limit = options.itemsPerPage;
  loadPersons();
};

const refreshData = () => {
  loadPersons();
  loadStats();
};

const openCreateDialog = () => {
  dialog.value = {
    show: true,
    person: null,
  };
};

const viewPerson = (person: Person) => {
  selectedPerson.value = person;
  viewDialog.value = true;
};

const editPerson = (person: Person) => {
  dialog.value = {
    show: true,
    person,
  };
};

const confirmDelete = (person: Person) => {
  personToDelete.value = person;
  deleteDialog.value = true;
};

const handleDelete = async () => {
  if (!personToDelete.value) return;

  deleteLoading.value = true;
  const success = await deletePerson(personToDelete.value._id!, softDelete.value);

  if (success) {
    showSnackbar(`Person ${softDelete.value ? "deactivated" : "deleted"} successfully`, "success");
    refreshData();
  } else {
    showSnackbar("Failed to delete person", "error");
  }

  deleteLoading.value = false;
  deleteDialog.value = false;
  personToDelete.value = null;
};

const handlePersonUpdate = (_person: Person) => {
  showSnackbar("Person saved successfully", "success");
  refreshData();
};

const showSnackbar = (message: string, color = "success") => {
  snackbar.value = {
    show: true,
    message,
    color,
  };
};

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString();
};

// Watch for errors
watch(error, newError => {
  if (newError) {
    showSnackbar(newError, "error");
  }
});

// Load initial data
onMounted(() => {
  refreshData();
});
</script>

<style scoped>
.v-card-title {
  background-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}
</style>
