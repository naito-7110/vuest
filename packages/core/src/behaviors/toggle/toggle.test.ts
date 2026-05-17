import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { Toggle } from '..'
import { defineComponent, h, ref } from 'vue'

describe('@vuest/core#Toggle', async () => {
  test('initial state without any props', async () => {
    const wrapper = mount(Toggle.Root, {
      props: {},
      slots: {
        default: () => [
          h(Toggle.Trigger, null, [
            h('button', {
              'data-testid': 'btn',
            }),
          ]),
        ],
      },
    })

    const button = wrapper.find('[data-testid="btn"]')
    expect(button.attributes('aria-pressed')).toBe('false')
    expect(button.attributes('aria-busy')).toBeUndefined()
    expect(button.attributes('aria-disabled')).toBeUndefined()
  })

  test('when loading is true, shows loading state and ignores clicks', async () => {
    const pressed = ref(false)
    const Parent = defineComponent({
      setup() {
        return () =>
          h(
            Toggle.Root,
            {
              pressed: pressed.value,
              loading: true,
              'onUpdate:pressed': (v: boolean) => (pressed.value = v),
            },
            () => h(Toggle.Trigger, null, () => h('button', { 'data-testid': 'btn' })),
          )
      },
    })

    const wrapper = mount(Parent)
    const button = wrapper.find('[data-testid="btn"]')

    expect(button.attributes('aria-pressed')).toBe('false')
    expect(button.attributes('aria-busy')).toBe('true')
    expect(button.attributes('aria-disabled')).toBe('true')

    await button.trigger('click')
    expect(pressed.value).toBe(false)
    expect(button.attributes('aria-pressed')).toBe('false')
  })

  test('initial state with pressed props', async () => {
    const wrapper = mount(Toggle.Root, {
      props: {
        pressed: true,
      },
      slots: {
        default: () => [
          h(Toggle.Trigger, null, [
            h('button', {
              'data-testid': 'btn',
            }),
          ]),
        ],
      },
    })

    const button = wrapper.find('[data-testid="btn"]')

    expect(button.attributes('aria-pressed')).toBe('true')
    expect(button.attributes('aria-busy')).toBeUndefined()
    expect(button.attributes('aria-disabled')).toBeUndefined()
  })

  test('when loading prop update to "true" aria-busy and aria-disabled update to "true"', async () => {
    const wrapper = mount(Toggle.Root, {
      props: {
        loading: false,
      },
      slots: {
        default: () => [
          h(Toggle.Trigger, null, [
            h('button', {
              'data-testid': 'btn',
            }),
          ]),
        ],
      },
    })

    const button = wrapper.find('[data-testid="btn"]')
    expect(button.attributes('aria-busy')).toBeUndefined()
    expect(button.attributes('aria-disabled')).toBeUndefined()

    await wrapper.setProps({ loading: true })

    expect(button.attributes('aria-busy')).toBe('true')
    expect(button.attributes('aria-disabled')).toBe('true')
  })

  test('clicking trigger toggles pressed state via v-model', async () => {
    const pressed = ref(false)
    const Parent = defineComponent({
      setup() {
        return () =>
          h(
            Toggle.Root,
            {
              pressed: pressed.value,
              'onUpdate:pressed': (v: boolean) => (pressed.value = v),
            },
            () => h(Toggle.Trigger, null, () => h('button', { 'data-testid': 'btn' })),
          )
      },
    })

    const wrapper = mount(Parent)
    const button = wrapper.find('[data-testid="btn"]')

    expect(pressed.value).toBe(false)
    expect(button.attributes('aria-pressed')).toBe('false')

    await button.trigger('click')
    expect(pressed.value).toBe(true)
    expect(button.attributes('aria-pressed')).toBe('true')

    await button.trigger('click')
    expect(pressed.value).toBe(false)
    expect(button.attributes('aria-pressed')).toBe('false')
  })
})
