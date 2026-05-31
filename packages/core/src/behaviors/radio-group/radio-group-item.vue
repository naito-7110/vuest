<script setup lang="ts">
import { computed } from 'vue'
import { Injection } from '../injection'
import { useRadioGroupRootContext } from './radio-group-root.vue'

interface RadioGroupItemProps {
  value: string
  disabled?: boolean
}

const props = withDefaults(defineProps<RadioGroupItemProps>(), {
  disabled: false,
})

const ctx = useRadioGroupRootContext()

const checked = computed(() => ctx.modelValue.value === props.value)
const composedDisabled = computed(() => ctx.disabled.value || props.disabled)

const onSelect = () => {
  if (composedDisabled.value) return
  ctx.onSelect(props.value)
}
</script>

<template>
  <Injection
    v-if="ctx.isFieldsetSlot"
    :checked="checked"
    :disabled="composedDisabled || undefined"
    :value="value"
    :name="ctx.name.value"
    @change="onSelect"
  >
    <slot :checked="checked" />
  </Injection>
  <Injection
    v-else
    role="radio"
    :aria-checked="checked"
    :aria-disabled="composedDisabled || undefined"
    :tabindex="checked ? 0 : -1"
    @click="onSelect"
  >
    <slot :checked="checked" />
  </Injection>
</template>
