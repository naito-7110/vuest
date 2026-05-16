import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import defineContext from './define-context'

describe('@vuest/core#define-context', async () => {
  type ContextValue = {
    value: string
  }

  test('should get ContextValue from root component in child component', async () => {
    const { provideContext, useContext } = defineContext<ContextValue>('ContextRoot')

    let ctx: ContextValue | null = null

    const Child = defineComponent({
      setup() {
        ctx = useContext()

        return () => h('div')
      },
    })

    const Root = defineComponent({
      setup() {
        provideContext({
          value: 'Provided Value',
        })

        return () => h(Child)
      },
    })

    mount(Root)

    expect(ctx).not.toBeNull()
    expect(ctx).not.toBeUndefined()
    if (ctx) {
      expect(ctx['value']).not.toBeUndefined()
      expect(ctx['value']).not.toBeNull()
      expect(ctx['value']).toEqual('Provided Value')
    }
  })

  test('should return fallback value when context was not provided', async () => {
    const { useContext } = defineContext<ContextValue>('ContextRoot')

    let ctx: ContextValue | null = null

    const fallback: ContextValue = {
      value: 'FallbackValue',
    }

    const Child = defineComponent({
      setup() {
        ctx = useContext(fallback)

        return () => h('div')
      },
    })

    const Root = defineComponent({
      setup() {
        return () => h(Child)
      },
    })

    mount(Root)

    expect(ctx).not.toBeNull()
    expect(ctx).not.toBeUndefined()

    if (ctx) {
      expect(ctx).toBe(fallback)
    }
  })

  test('should throw Error when context was not provided without fallback', async () => {
    const { useContext } = defineContext<ContextValue>('ContextRoot')

    const Child = defineComponent({
      setup() {
        useContext()

        return () => h('div')
      },
    })

    expect(() => mount(Child)).toThrow('ContextRootContext was not found.')
  })
})
