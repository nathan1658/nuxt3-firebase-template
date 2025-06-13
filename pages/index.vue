<template>
  <VContainer>
    <ClientOnly><LanguageSelectBox /></ClientOnly>
    <BaseCard>{{ $t("helloWorld") }}</BaseCard>
    <div class="bg-red">{{ t }}</div>
    <VBtn @click="refresh">Fetch</VBtn>
    <ul>
      {{
        todos
      }}
      <li
        v-for="todo in todos"
        :key="todo.id"
      >
        <span>{{ todo.text }}</span>
      </li>
    </ul>
  </VContainer>
</template>

<script setup>
import { useCollection } from "vuefire";
import { collection, getFirestore } from "firebase/firestore";
const db = getFirestore();
const todos = useCollection(collection(db, "todos"));
const { data: t, refresh } = useAsyncData("the", () => $fetch("/api"));
</script>

<style scoped></style>
