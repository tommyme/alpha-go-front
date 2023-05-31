<script setup>
import { LinkItemPropsConfig } from './LinkItem'
import LinkItemContent from './LinkItemContent.vue'

const props = defineProps(LinkItemPropsConfig)
</script>
<template>
  <!-- 如果有children 就用expansion item -->
  <div v-if="children.length > 0">
    <q-expansion-item clickable tag="a" :href="link" :content-inset-level="1">
      <template #header>
        <LinkItemContent :data="data" />
      </template>
      <template v-if="children">
        <LinkItem v-for="(child, idx) in children" :key="idx" :link="child.link" :data="child.data"></LinkItem>
      </template>
    </q-expansion-item>
  </div>
  <!-- 如果没有children 或者children为空 就直接用item -->
  <div v-else>
    <q-item :href="link">
      <LinkItemContent :data="data" />
    </q-item>
  </div>
</template>
