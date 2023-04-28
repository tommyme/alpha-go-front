<script setup>
import { onMounted, ref, reactive } from 'vue';

import { api } from "boot/axios"
import { useRoute, useRouter } from 'vue-router';
const articles = ref([])
const router = useRouter()

onMounted(() => {
  api.get("/stateless/articles").then((resp) => resp.data).then((data) => articles.value = data)
})

const viewArticle = (id) => {
  router.push({ path: `view/${id}` })
}
</script>

<template>
  <q-page class="flex flex-center">
    <div class="">
      <q-list bordered class="rounded-borders">
        <q-item v-for="article, idx in articles" :key="idx">
          <q-item clickable v-ripple @click="viewArticle(article.id)">
            <q-item-section class="text-h5">{{ article.title }}</q-item-section>
          </q-item>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<style scoped></style>
