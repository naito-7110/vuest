import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import { RadioGroup } from '..'

describe('@vuest/core#RadioGroup', async () => {
  describe('WAIARIA mode (non-fieldset slot)', async () => {
    test('injects role="radiogroup" and aria-orientation onto Root wrapper', async () => {
      const wrapper = mount(
        defineComponent({
          setup: () => () =>
            h(RadioGroup.Root, { orientation: 'horizontal' }, () =>
              h('div', { 'data-testid': 'group' }, [
                h(RadioGroup.Item, { value: 'a' }, () =>
                  h('button', { 'data-testid': 'item-a' }),
                ),
              ]),
            ),
        }),
      )

      const group = wrapper.find('[data-testid="group"]')
      expect(group.attributes('role')).toBe('radiogroup')
      expect(group.attributes('aria-orientation')).toBe('horizontal')
    })

    test('injects aria-disabled when Root.disabled is true', async () => {
      const wrapper = mount(
        defineComponent({
          setup: () => () =>
            h(RadioGroup.Root, { disabled: true }, () =>
              h('div', { 'data-testid': 'group' }, [
                h(RadioGroup.Item, { value: 'a' }, () =>
                  h('button', { 'data-testid': 'item-a' }),
                ),
              ]),
            ),
        }),
      )

      expect(wrapper.find('[data-testid="group"]').attributes('aria-disabled')).toBe('true')
    })

    test('renders role="radio" with aria-checked based on modelValue', async () => {
      const modelValue = ref<string | undefined>('b')
      const wrapper = mount(
        defineComponent({
          setup: () => () =>
            h(
              RadioGroup.Root,
              {
                modelValue: modelValue.value,
                'onUpdate:modelValue': (v: string | undefined) => (modelValue.value = v),
              },
              () =>
                h('div', null, [
                  h(RadioGroup.Item, { value: 'a' }, () =>
                    h('button', { 'data-testid': 'item-a' }),
                  ),
                  h(RadioGroup.Item, { value: 'b' }, () =>
                    h('button', { 'data-testid': 'item-b' }),
                  ),
                ]),
            ),
        }),
      )

      const a = wrapper.find('[data-testid="item-a"]')
      const b = wrapper.find('[data-testid="item-b"]')

      expect(a.attributes('role')).toBe('radio')
      expect(a.attributes('aria-checked')).toBe('false')
      expect(a.attributes('tabindex')).toBe('-1')

      expect(b.attributes('role')).toBe('radio')
      expect(b.attributes('aria-checked')).toBe('true')
      expect(b.attributes('tabindex')).toBe('0')
    })

    test('click updates modelValue', async () => {
      const modelValue = ref<string | undefined>(undefined)
      const wrapper = mount(
        defineComponent({
          setup: () => () =>
            h(
              RadioGroup.Root,
              {
                modelValue: modelValue.value,
                'onUpdate:modelValue': (v: string | undefined) => (modelValue.value = v),
              },
              () =>
                h('div', null, [
                  h(RadioGroup.Item, { value: 'a' }, () =>
                    h('button', { 'data-testid': 'item-a' }),
                  ),
                  h(RadioGroup.Item, { value: 'b' }, () =>
                    h('button', { 'data-testid': 'item-b' }),
                  ),
                ]),
            ),
        }),
      )

      await wrapper.find('[data-testid="item-a"]').trigger('click')
      expect(modelValue.value).toBe('a')

      await wrapper.find('[data-testid="item-b"]').trigger('click')
      expect(modelValue.value).toBe('b')
    })

    test('disabled on Root prevents selection on all items', async () => {
      const modelValue = ref<string | undefined>(undefined)
      const wrapper = mount(
        defineComponent({
          setup: () => () =>
            h(
              RadioGroup.Root,
              {
                modelValue: modelValue.value,
                disabled: true,
                'onUpdate:modelValue': (v: string | undefined) => (modelValue.value = v),
              },
              () =>
                h('div', null, [
                  h(RadioGroup.Item, { value: 'a' }, () =>
                    h('button', { 'data-testid': 'item-a' }),
                  ),
                ]),
            ),
        }),
      )

      const a = wrapper.find('[data-testid="item-a"]')
      expect(a.attributes('aria-disabled')).toBe('true')

      await a.trigger('click')
      expect(modelValue.value).toBeUndefined()
    })

    test('disabled on Item prevents only that item from being selected', async () => {
      const modelValue = ref<string | undefined>(undefined)
      const wrapper = mount(
        defineComponent({
          setup: () => () =>
            h(
              RadioGroup.Root,
              {
                modelValue: modelValue.value,
                'onUpdate:modelValue': (v: string | undefined) => (modelValue.value = v),
              },
              () =>
                h('div', null, [
                  h(RadioGroup.Item, { value: 'a', disabled: true }, () =>
                    h('button', { 'data-testid': 'item-a' }),
                  ),
                  h(RadioGroup.Item, { value: 'b' }, () =>
                    h('button', { 'data-testid': 'item-b' }),
                  ),
                ]),
            ),
        }),
      )

      const a = wrapper.find('[data-testid="item-a"]')
      const b = wrapper.find('[data-testid="item-b"]')

      expect(a.attributes('aria-disabled')).toBe('true')
      expect(b.attributes('aria-disabled')).toBeUndefined()

      await a.trigger('click')
      expect(modelValue.value).toBeUndefined()

      await b.trigger('click')
      expect(modelValue.value).toBe('b')
    })

    test('exposes checked via slot prop', async () => {
      const modelValue = ref<string | undefined>('a')
      const wrapper = mount(
        defineComponent({
          setup: () => () =>
            h(
              RadioGroup.Root,
              { modelValue: modelValue.value },
              () =>
                h('div', null, [
                  h(
                    RadioGroup.Item,
                    { value: 'a' },
                    {
                      default: ({ checked }: { checked: boolean }) =>
                        h('button', { 'data-testid': 'item-a', 'data-checked': String(checked) }),
                    },
                  ),
                  h(
                    RadioGroup.Item,
                    { value: 'b' },
                    {
                      default: ({ checked }: { checked: boolean }) =>
                        h('button', { 'data-testid': 'item-b', 'data-checked': String(checked) }),
                    },
                  ),
                ]),
            ),
        }),
      )

      expect(wrapper.find('[data-testid="item-a"]').attributes('data-checked')).toBe('true')
      expect(wrapper.find('[data-testid="item-b"]').attributes('data-checked')).toBe('false')
    })
  })

  describe('Fieldset mode', async () => {
    test('injects aria-disabled onto fieldset when Root.disabled is true', async () => {
      const wrapper = mount(
        defineComponent({
          setup: () => () =>
            h(RadioGroup.Root, { disabled: true }, () =>
              h('fieldset', { 'data-testid': 'group' }, [
                h(RadioGroup.Item, { value: 'a' }, () =>
                  h('input', { type: 'radio', 'data-testid': 'item-a' }),
                ),
              ]),
            ),
        }),
      )

      const group = wrapper.find('[data-testid="group"]')
      expect(group.attributes('aria-disabled')).toBe('true')
      expect(group.attributes('role')).toBeUndefined()
    })

    test('renders native input attrs with shared name and checked state', async () => {
      const modelValue = ref<string | undefined>('b')
      const wrapper = mount(
        defineComponent({
          setup: () => () =>
            h(
              RadioGroup.Root,
              {
                modelValue: modelValue.value,
                name: 'group1',
                'onUpdate:modelValue': (v: string | undefined) => (modelValue.value = v),
              },
              () =>
                h('fieldset', null, [
                  h(RadioGroup.Item, { value: 'a' }, () =>
                    h('input', { type: 'radio', 'data-testid': 'item-a' }),
                  ),
                  h(RadioGroup.Item, { value: 'b' }, () =>
                    h('input', { type: 'radio', 'data-testid': 'item-b' }),
                  ),
                ]),
            ),
        }),
      )

      const a = wrapper.find<HTMLInputElement>('[data-testid="item-a"]')
      const b = wrapper.find<HTMLInputElement>('[data-testid="item-b"]')

      expect(a.attributes('name')).toBe('group1')
      expect(a.attributes('value')).toBe('a')
      expect(a.element.checked).toBe(false)

      expect(b.attributes('name')).toBe('group1')
      expect(b.attributes('value')).toBe('b')
      expect(b.element.checked).toBe(true)
    })

    test('change event on native input updates modelValue', async () => {
      const modelValue = ref<string | undefined>(undefined)
      const wrapper = mount(
        defineComponent({
          setup: () => () =>
            h(
              RadioGroup.Root,
              {
                modelValue: modelValue.value,
                name: 'group1',
                'onUpdate:modelValue': (v: string | undefined) => (modelValue.value = v),
              },
              () =>
                h('fieldset', null, [
                  h(RadioGroup.Item, { value: 'a' }, () =>
                    h('input', { type: 'radio', 'data-testid': 'item-a' }),
                  ),
                ]),
            ),
        }),
      )

      const a = wrapper.find<HTMLInputElement>('[data-testid="item-a"]')
      a.element.checked = true
      await a.trigger('change')

      expect(modelValue.value).toBe('a')
    })

    test('auto-generates name when not provided and shares it across items', async () => {
      const wrapper = mount(
        defineComponent({
          setup: () => () =>
            h(RadioGroup.Root, null, () =>
              h('fieldset', null, [
                h(RadioGroup.Item, { value: 'a' }, () =>
                  h('input', { type: 'radio', 'data-testid': 'item-a' }),
                ),
                h(RadioGroup.Item, { value: 'b' }, () =>
                  h('input', { type: 'radio', 'data-testid': 'item-b' }),
                ),
              ]),
            ),
        }),
      )

      const nameA = wrapper.find('[data-testid="item-a"]').attributes('name')
      const nameB = wrapper.find('[data-testid="item-b"]').attributes('name')

      expect(nameA).toBeDefined()
      expect(nameA).toBe(nameB)
    })
  })
})
