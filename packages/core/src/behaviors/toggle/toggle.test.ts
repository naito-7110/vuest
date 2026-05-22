import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { Toggle } from '..'
import { defineComponent, h, ref } from 'vue'

describe('@vuest/core#Toggle', async () => {
  test.each([
    { props: {}, expectedPressed: 'false', expectedBusy: undefined, expectedDisabled: undefined },
    { props: { pressed: true }, expectedPressed: 'true', expectedBusy: undefined, expectedDisabled: undefined },
    { props: { loading: true }, expectedPressed: 'false', expectedBusy: 'true', expectedDisabled: 'true' },
    { props: { pressed: true, loading: true }, expectedPressed: 'true', expectedBusy: 'true', expectedDisabled: 'true' },
  ])('initial state with props: $props', async ({ props, expectedPressed, expectedBusy, expectedDisabled }) => {
    const wrapper = mount(Toggle.Root, {
      props,
      slots: {
        default: () => h(Toggle.Trigger, null, () => h('button', { 'data-testid': 'btn' })),
      },
    })

    const button = wrapper.find('[data-testid="btn"]')
    expect(button.attributes('aria-pressed')).toBe(expectedPressed)
    expect(button.attributes('aria-busy')).toBe(expectedBusy)
    expect(button.attributes('aria-disabled')).toBe(expectedDisabled)
  })

  test('when loading prop update to "true" aria-busy and aria-disabled update to "true"', async () => {
    const wrapper = mount(Toggle.Root, {
      props: {
        loading: false,
      },
      slots: {
        default: () => h(Toggle.Trigger, null, () => h('button', { 'data-testid': 'btn' })),
      },
    })

    const button = wrapper.find('[data-testid="btn"]')
    expect(button.attributes('aria-busy')).toBeUndefined()
    expect(button.attributes('aria-disabled')).toBeUndefined()

    await wrapper.setProps({ loading: true })

    expect(button.attributes('aria-busy')).toBe('true')
    expect(button.attributes('aria-disabled')).toBe('true')
  })

  test.each([
    { loading: false, initialPressed: false, expectedAfterClick: true },
    { loading: false, initialPressed: true, expectedAfterClick: false },
    { loading: true, initialPressed: false, expectedAfterClick: false },
    { loading: true, initialPressed: true, expectedAfterClick: true },
  ])('click behavior with loading=$loading, pressed=$initialPressed', async ({ loading, initialPressed, expectedAfterClick }) => {
    const pressed = ref(initialPressed)
    const Parent = defineComponent({
      setup: () => () =>
        h(Toggle.Root, {
          pressed: pressed.value,
          loading,
          'onUpdate:pressed': (v: boolean) => (pressed.value = v),
        }, () => h(Toggle.Trigger, null, () => h('button', { 'data-testid': 'btn' }))),
    })

    const wrapper = mount(Parent)
    await wrapper.find('[data-testid="btn"]').trigger('click')

    expect(pressed.value).toBe(expectedAfterClick)
  })

  test('works correctly when other elements are nested between Root and Trigger', async () => {
    const pressed = ref(false)
    const Parent = defineComponent({
      setup: () => () =>
        h(Toggle.Root, {
          pressed: pressed.value,
          'onUpdate:pressed': (v: boolean) => (pressed.value = v),
        }, () => h('div', { class: 'wrapper' }, [
          h('span', 'label'),
          h(Toggle.Trigger, null, () => h('button', { 'data-testid': 'btn' })),
        ])),
    })

    const wrapper = mount(Parent)
    const button = wrapper.find('[data-testid="btn"]')

    expect(button.attributes('aria-pressed')).toBe('false')

    await button.trigger('click')

    expect(pressed.value).toBe(true)
    expect(button.attributes('aria-pressed')).toBe('true')
  })
})
