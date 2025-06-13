import type { CreatePerson, UpdatePerson, Person, PersonQuery } from "~/server/schemas/person.schema";
import type { PersonResponse, PersonListResponse, PersonStatsResponse } from "~/types/api";

export const usePerson = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const handleError = (err: unknown): string => {
    if (err && typeof err === "object") {
      if ("data" in err && err.data && typeof err.data === "object" && "message" in err.data) {
        return err.data.message as string;
      }
      if ("statusMessage" in err && typeof err.statusMessage === "string") {
        return err.statusMessage;
      }
    }
    return "An unexpected error occurred";
  };

  const createPerson = async (data: CreatePerson): Promise<Person | null> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<PersonResponse>("/api/person", {
        method: "POST",
        body: data,
      });
      return response.data;
    } catch (err) {
      error.value = handleError(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const getPerson = async (id: string): Promise<Person | null> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<PersonResponse>(`/api/person/${id}`);
      return response.data;
    } catch (err) {
      error.value = handleError(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updatePerson = async (id: string, data: UpdatePerson): Promise<Person | null> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<PersonResponse>(`/api/person/${id}`, {
        method: "PATCH",
        body: data,
      });
      return response.data;
    } catch (err) {
      error.value = handleError(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const deletePerson = async (id: string, soft = false): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`/api/person/${id}?soft=${soft}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (err) {
      error.value = handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const getPersons = async (query?: PersonQuery) => {
    loading.value = true;
    error.value = null;

    try {
      const params = new URLSearchParams();
      if (query) {
        Object.entries(query).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }

      const response = await $fetch(`/api/person?${params.toString()}`);
      return response;
    } catch (err) {
      error.value = handleError(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const searchPersons = async (searchTerm: string): Promise<Person[] | null> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<PersonListResponse>(`/api/person/search?q=${encodeURIComponent(searchTerm)}`);
      return response.data;
    } catch (err) {
      error.value = handleError(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const getPersonStats = async (): Promise<PersonStatsResponse["data"] | null> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<PersonStatsResponse>("/api/person/stats");
      return response.data;
    } catch (err) {
      error.value = handleError(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading: readonly(loading),
    error: readonly(error),
    createPerson,
    getPerson,
    updatePerson,
    deletePerson,
    getPersons,
    searchPersons,
    getPersonStats,
  };
};
