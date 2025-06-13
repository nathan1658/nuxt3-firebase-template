<template>
  <VDialog
    v-model="dialog"
    max-width="600px"
    persistent
  >
    <VCard>
      <VCardTitle class="text-h5">
        {{ isEdit ? "Edit Person" : "Create Person" }}
      </VCardTitle>

      <VCardText>
        <VContainer>
          <VForm
            ref="formRef"
            v-model="valid"
            @submit.prevent="handleSubmit"
          >
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.firstName"
                  :rules="[rules.required, rules.maxLength(50)]"
                  label="First Name"
                  required
                  variant="outlined"
                  density="comfortable"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.lastName"
                  :rules="[rules.required, rules.maxLength(50)]"
                  label="Last Name"
                  required
                  variant="outlined"
                  density="comfortable"
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="formData.email"
                  :rules="[rules.required, rules.email]"
                  label="Email"
                  required
                  type="email"
                  variant="outlined"
                  density="comfortable"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model.number="formData.age"
                  :rules="[rules.required, rules.age]"
                  label="Age"
                  required
                  type="number"
                  variant="outlined"
                  density="comfortable"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.phone"
                  :rules="[rules.phone]"
                  label="Phone (Optional)"
                  variant="outlined"
                  density="comfortable"
                />
              </VCol>

              <VCol cols="12">
                <VTextarea
                  v-model="formData.address"
                  :rules="[rules.maxLength(200)]"
                  label="Address (Optional)"
                  variant="outlined"
                  density="comfortable"
                  rows="3"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="formData.department"
                  :items="departments"
                  :rules="[rules.maxLength(50)]"
                  label="Department (Optional)"
                  variant="outlined"
                  density="comfortable"
                  clearable
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="formData.position"
                  :items="positions"
                  :rules="[rules.maxLength(50)]"
                  label="Position (Optional)"
                  variant="outlined"
                  density="comfortable"
                  clearable
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model.number="formData.salary"
                  :rules="[rules.positiveNumber]"
                  label="Salary (Optional)"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  prefix="$"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.hireDate"
                  label="Hire Date (Optional)"
                  type="date"
                  variant="outlined"
                  density="comfortable"
                />
              </VCol>

              <VCol cols="12">
                <VCheckbox
                  v-model="formData.isActive"
                  label="Active"
                  density="comfortable"
                />
              </VCol>
            </VRow>
          </VForm>

          <VAlert
            v-if="error"
            type="error"
            class="mt-4"
            closable
            @click:close="error = null"
          >
            {{ error }}
          </VAlert>
        </VContainer>
      </VCardText>

      <VCardActions>
        <VSpacer />
        <VBtn
          color="grey-darken-1"
          variant="text"
          @click="closeDialog"
        >
          Cancel
        </VBtn>
        <VBtn
          :loading="loading"
          :disabled="!valid"
          color="primary"
          variant="elevated"
          @click="handleSubmit"
        >
          {{ isEdit ? "Update" : "Create" }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import type { CreatePerson, UpdatePerson, Person } from "~/server/schemas/person.schema";

interface Props {
  modelValue: boolean;
  person?: Person | null;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "success", person: Person): void;
}

const props = withDefaults(defineProps<Props>(), {
  person: null,
});

const resetForm = () => {
  formData.value = { ...defaultFormData };
  error.value = null;
  if (formRef.value) {
    formRef.value.resetValidation();
  }
};

const emit = defineEmits<Emits>();

const { createPerson, updatePerson, loading, error: apiError } = usePerson();

const dialog = computed({
  get: () => props.modelValue,
  set: value => emit("update:modelValue", value),
});

const isEdit = computed(() => !!props.person);
const formRef = ref();
const valid = ref(false);
const error = ref<string | null>(null);

// Form data with default values
const defaultFormData: CreatePerson = {
  firstName: "",
  lastName: "",
  email: "",
  age: 0,
  phone: "",
  address: "",
  department: "",
  position: "",
  salary: undefined,
  hireDate: undefined,
  isActive: true,
};

const formData = ref<CreatePerson>({ ...defaultFormData });

// Dropdown options
const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations"];

const positions = ["Developer", "Designer", "Manager", "Analyst", "Specialist", "Director"];

// Validation rules
const rules = {
  required: (value: string) => !!value || "This field is required",
  email: (value: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value) || "Invalid email format";
  },
  maxLength: (length: number) => (value: string) => !value || value.length <= length || `Maximum ${length} characters`,
  age: (value: number) => {
    if (!value) return "Age is required";
    if (value < 0) return "Age must be positive";
    if (value > 150) return "Age must be realistic";
    return true;
  },
  positiveNumber: (value: number) => !value || value >= 0 || "Must be a positive number",
  phone: (value: string) => {
    if (!value) return true;
    const pattern = /^[+]?[\d\s\-()]+$/;
    return pattern.test(value) || "Invalid phone number format";
  },
};

// Watch for person changes to populate form
watch(
  () => props.person,
  newPerson => {
    if (newPerson) {
      formData.value = {
        firstName: newPerson.firstName,
        lastName: newPerson.lastName,
        email: newPerson.email,
        age: newPerson.age,
        phone: newPerson.phone || "",
        address: newPerson.address || "",
        department: newPerson.department || "",
        position: newPerson.position || "",
        salary: newPerson.salary,
        hireDate: newPerson.hireDate ? new Date(newPerson.hireDate).toISOString().split("T")[0] : undefined,
        isActive: newPerson.isActive,
      };
    } else {
      resetForm();
    }
  },
  { immediate: true },
);

// Watch for API errors
watch(apiError, newError => {
  if (newError) {
    error.value = newError;
  }
});

const closeDialog = () => {
  dialog.value = false;
  resetForm();
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  const { valid: isValid } = await formRef.value.validate();
  if (!isValid) return;

  error.value = null;

  try {
    let result: Person | null = null;

    if (isEdit.value && props.person) {
      // Convert form data to UpdatePerson format
      const updateData: UpdatePerson = { ...formData.value };

      // Remove empty optional fields
      const cleanedUpdateData: Partial<UpdatePerson> = {};
      Object.keys(updateData).forEach(key => {
        const value = updateData[key as keyof UpdatePerson];
        if (value !== "" && value !== undefined) {
          (cleanedUpdateData as Record<string, unknown>)[key] = value;
        }
      });

      result = await updatePerson(props.person._id!, cleanedUpdateData as UpdatePerson);
    } else {
      // Create new person
      const createData: CreatePerson = { ...formData.value };

      // Remove empty optional fields
      const cleanedCreateData: Partial<CreatePerson> = {};
      Object.keys(createData).forEach(key => {
        const value = createData[key as keyof CreatePerson];
        if (value !== "" && value !== undefined) {
          (cleanedCreateData as Record<string, unknown>)[key] = value;
        }
      });

      result = await createPerson(cleanedCreateData as CreatePerson);
    }

    if (result) {
      emit("success", result);
      closeDialog();
    }
  } catch {
    error.value = "An unexpected error occurred";
  }
};
</script>

<style scoped>
.v-card-title {
  background-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}
</style>
