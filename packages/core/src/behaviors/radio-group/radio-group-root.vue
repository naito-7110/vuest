<script lang="ts">
import { computed, toRef, useId, useSlots, type Ref } from 'vue'
import { defineContext } from '../../api'
import { getFirstNonCommentChildElementTypeName, isHTMLTagName } from '../../utils'
import FieldsetRoot from './radio-group-root.fieldset.vue'
import WAIARIARoot from './radio-group-root.waiaria.vue'

interface WAIARIAContext {
  isFieldsetSlot: false
}

interface FieldsetContext {
  isFieldsetSlot: true
}

interface RadioGroupBehaviorsContext {
  modelValue: Readonly<Ref<string | undefined>>
  disabled: Readonly<Ref<boolean>>
  name: Readonly<Ref<string>>
  onSelect: (value: string) => void
}

type RadioGroupRootContext = RadioGroupBehaviorsContext & (WAIARIAContext | FieldsetContext)

interface RadioGroupRootProps {
  disabled?: boolean
  name?: string
  orientation?: 'horizontal' | 'vertical'
}

const { provideContext, useContext: useRadioGroupRootContext } =
  defineContext<RadioGroupRootContext>('RadioGroupRoot')

export { useRadioGroupRootContext }
</script>

<script setup lang="ts">
const modelValue = defineModel<string>({
  required: false,
})

const props = withDefaults(defineProps<RadioGroupRootProps>(), {
  disabled: false,
  orientation: 'vertical',
})

const disabled = toRef(props, 'disabled')

const fallbackName = useId()
const name = computed(() => props.name ?? fallbackName)

const slots = useSlots()

if (!slots.default) throw new Error('RadioGroup.Root requires a default slot')

const firstChildType = getFirstNonCommentChildElementTypeName(slots.default())

if (firstChildType === undefined) {
  throw new Error('RadioGroup.Root requires at least one child element')
}

const isFieldsetSlot = isHTMLTagName(firstChildType, 'fieldset')

const onSelect = (value: string) => {
  if (disabled.value) return
  modelValue.value = value
}

const baseCtx: RadioGroupBehaviorsContext = {
  modelValue,
  disabled,
  name,
  onSelect,
}

provideContext(
  isFieldsetSlot ? { ...baseCtx, isFieldsetSlot: true } : { ...baseCtx, isFieldsetSlot: false },
)
</script>

<template>
  <FieldsetRoot
    v-if="isFieldsetSlot"
    :disabled="disabled"
  >
    <slot />
  </FieldsetRoot>
  <WAIARIARoot
    v-else
    :disabled="disabled"
    :orientation="orientation"
  >
    <slot />
  </WAIARIARoot>
</template>
