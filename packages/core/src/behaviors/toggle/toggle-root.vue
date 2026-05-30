<script lang="ts">
import type { Ref } from 'vue'
import { toRef } from 'vue'
import { defineContext } from '../../api'

interface ToggleRootProps {
  loading?: boolean
}
interface ToggleRootContext {
  pressed: Readonly<Ref<boolean>>
  disabled: Readonly<Ref<boolean>>
  onPressedToggle: (pressed: boolean) => void
}

const { provideContext, useContext: useToggleRootContext } =
  defineContext<ToggleRootContext>('ToggleRoot')

export { useToggleRootContext }
</script>

<script lang="ts" setup>
const pressed = defineModel<boolean>('pressed', {
  required: false,
  default: false,
})

const props = withDefaults(defineProps<ToggleRootProps>(), {
  loading: false,
})
const loading = toRef(props, 'loading')

provideContext({
  pressed: pressed,
  disabled: loading,
  onPressedToggle: (newPressed) => {
    if (loading.value) return

    pressed.value = newPressed
  },
})
</script>

<template>
  <slot :pressed="pressed" />
</template>
