<script lang="ts" setup>
import { Injection } from '../injection'
import { useToggleRootContext } from './toggle-root.vue'

const { pressed, disabled, onPressedToggle } = useToggleRootContext()
</script>

<template>
  <Injection
    :aria-pressed="pressed"
    :aria-busy="disabled || undefined"
    :aria-disabled="disabled || undefined"
    @click="onPressedToggle(!pressed)"
  >
    <slot />
  </Injection>
</template>
