<script setup>
import { api } from 'src/boot/axios';
import { ref } from 'vue';

const title = ref("")
const editor = ref("")

const submit = () => {
  api.post("/admin/article/add", {
    title: title.value,
    content: editor.value
  })
}
</script>

<template>
  <q-page class="flex column">
    <div class="row q-pa-md">
      <div class="col-6">
        <q-input v-model="title" outlined label="title"></q-input>
      </div>
    </div>
    <div class="row">
      <div class="q-pa-md q-gutter-sm col-9">
        <q-editor v-model="editor" :definitions="{
          bold: { label: 'Bold', icon: null, tip: 'My bold tooltip' }
        }" />
      </div>
    </div>
    <div class="row q-pa-md">
      <div>
        <q-btn label="submit" @click="submit"></q-btn>
      </div>
    </div>
  </q-page>
</template>

<style scoped></style>
