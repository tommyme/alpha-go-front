<script setup>
import { onMounted, ref, reactive } from 'vue';

import { api } from "boot/axios"
import { useRoute, useRouter } from 'vue-router';
const articles = ref([])
const router = useRouter()

onMounted(() => {
  api.get("articles").then((resp) => resp.data).then((data) => articles.value = data)
})

const viewArticle = (id) => {
  router.push({ path: `/admin/article/${id}` })
}

const deleteArticle = (id) => {
  // api.get("")
  console.log('trying to delete article: ' + id)
}
</script>

<template>
  <q-page class="row">
    <div class="col-8 row justify-center" style="flex-grow: 1;">
      <q-list bordered class="rounded-borders col-10">
        <q-item v-for="article, idx in articles" :key="idx" clickable v-ripple @click="viewArticle(article.id)"
          class="justify-evenly">
          <q-item-section>{{ article.title }}</q-item-section>
          <q-item-section class="col-2">
            <q-btn label="del" color="primary" @click="deleteArticle(article.id)"></q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<style scoped></style>
