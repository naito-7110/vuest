<script setup lang="ts">
import { Injection } from '../injection'

defineProps<{
  value: string
  checked: boolean
  disabled: boolean
  name: string
}>()

defineEmits<{
  select: []
}>()
</script>

<template>
  <Injection
    :checked="checked"
    :disabled="disabled || undefined"
    :value="value"
    :name="name"
    @change="$emit('select')"
  >
    <slot :checked="checked" />
  </Injection>
</template>
