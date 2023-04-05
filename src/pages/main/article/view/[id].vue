<script setup>
import { api } from 'src/boot/axios';
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router';
const router = useRouter()
const route = useRoute()
const articleTitle = ref("")
const articleContent = ref("")

onMounted(() => {
  api.get('article/' + route.params.id).then(resp => resp.data).then(data => {
    articleContent.value = data.content
    articleTitle.value = data.title
  })
})
</script>

<template>
  <q-page class="flex flex-center">
    <h3>{{ articleTitle }}</h3>
    <article style="flex-basis: 50%;" v-html="articleContent">
    </article>
  </q-page>
</template>


<style scoped></style>
