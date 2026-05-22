import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import Injection from './injection'
import { Fragment, h, Comment } from 'vue'

describe('@vuest/core#injection', async () => {
  test('should inject attrs into slot component', async () => {
    const wrapper = mount(Injection, {
      attrs: {
        'dummy-props': 'ExpectedValue',
      },
      slots: {
        default: () =>
          h('div', {
            'data-testid': 'injection-target',
          }),
      },
    })

    const child = wrapper.find('[data-testid="injection-target"]')

    expect(child.exists()).toBe(true)
    expect(child.attributes('dummy-props')).not.toBeUndefined()
    expect(child.attributes('dummy-props')).toEqual('ExpectedValue')
  })

  test('should inject attrs into the first not commented child without fragment', async () => {
    const wrapper = mount(Injection, {
      attrs: {
        'expected-props': 'ExpectedValue',
      },
      slots: {
        default: () => [
          h(Comment, 'comment1'),
          h(Fragment, null, [
            h(Comment, 'comment2'),
            h('div', {
              'data-testid': 'injection-target',
            }),
          ]),
        ],
      },
    })

    const child = wrapper.find('[data-testid="injection-target"]')

    // 対象のエレメントに属性を透過
    expect(child.exists()).toBe(true)
    expect(child.attributes('expected-props')).not.toBeUndefined()
    expect(child.attributes('expected-props')).toEqual('ExpectedValue')

    // コメントのレンダリング
    const html = wrapper.html()
    expect(html).include('comment1')
    expect(html).include('comment2')
  })

  test('should override Injection props with props directly assigned to the child component', async () => {
    const wrapper = mount(Injection, {
      attrs: {
        'samename-props': 'Injection',
      },
      slots: {
        default: () =>
          h('div', {
            'data-testid': 'injection-target',
            'samename-props': 'Child',
          }),
      },
    })

    const child = wrapper.find('[data-testid="injection-target"]')
    expect(child.attributes('samename-props')).toEqual('Child')
  })
})
