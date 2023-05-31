<script setup>
import { api } from 'src/boot/axios'
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const articleTitle = ref('')
const articleContent = ref('')

onMounted(() => {
  api
    .get('/stateless/article/' + route.params.id)
    .then((resp) => resp.data[0])
    .then((data) => {
      console.log(data)
      articleContent.value = data.content
      articleTitle.value = data.title
    })
})
</script>

<template>
  <q-page class="flex flex-center">
    <h3>{{ articleTitle }}</h3>
    <article style="flex-basis: 50%" v-html="articleContent"></article>
  </q-page>
</template>

<style scoped></style>
