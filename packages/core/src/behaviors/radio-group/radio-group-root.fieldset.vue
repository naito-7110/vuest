<script setup lang="ts">
import { Injection } from '../injection'

defineProps<{
  disabled: boolean
}>()
</script>

<template>
  <Injection :aria-disabled="disabled || undefined">
    <slot />
  </Injection>
</template>
