<script setup lang="ts">
import type { LinkItemContentProps } from './LinkItemContent'
defineProps<LinkItemContentProps>()
</script>

<template>
  <q-item-section v-if="data.icon" avatar>
    <q-icon :name="data.icon" />
  </q-item-section>

  <q-item-section>
    <q-item-label>{{ data.title }}</q-item-label>
    <q-item-label caption>{{ data.caption }}</q-item-label>
  </q-item-section>
</template>

<style scoped></style>
