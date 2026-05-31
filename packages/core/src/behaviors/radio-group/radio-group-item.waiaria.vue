<script setup lang="ts">
import { Injection } from '../injection'

defineProps<{
  checked: boolean
  disabled: boolean
}>()

defineEmits<{
  select: []
}>()
</script>

<template>
  <Injection
    role="radio"
    :aria-checked="checked"
    :aria-disabled="disabled || undefined"
    :tabindex="checked ? 0 : -1"
    @click="$emit('select')"
  >
    <slot :checked="checked" />
  </Injection>
</template>
