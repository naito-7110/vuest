<script setup lang="ts">
import { Injection } from '../injection'

defineProps<{
  disabled: boolean
  orientation: 'horizontal' | 'vertical'
}>()
</script>

<template>
  <Injection
    role="radiogroup"
    :aria-disabled="disabled || undefined"
    :aria-orientation="orientation"
  >
    <slot />
  </Injection>
</template>
