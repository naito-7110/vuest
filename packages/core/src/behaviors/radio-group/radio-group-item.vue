<script setup lang="ts">
import { computed } from 'vue'
import FieldsetItem from './radio-group-item.fieldset.vue'
import WAIARIAItem from './radio-group-item.waiaria.vue'
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
  <FieldsetItem
    v-if="ctx.isFieldsetSlot"
    :value="value"
    :checked="checked"
    :disabled="composedDisabled"
    :name="ctx.name.value"
    @select="onSelect"
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </FieldsetItem>
  <WAIARIAItem
    v-else
    :checked="checked"
    :disabled="composedDisabled"
    @select="onSelect"
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </WAIARIAItem>
</template>
