import { Comment, cloneVNode, defineComponent, mergeProps } from 'vue'
import { flattenVNodes } from '../../utils'

function omitRef<TProps extends Record<string, unknown> | null | undefined>(props: TProps) {
  if (!props) return props

  if (!('ref' in props)) return props

  const { ref: _, ...rest } = props

  return rest as TProps
}

const Injection = defineComponent({
  name: 'Injection',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () => {
      if (!slots.default) return null

      const children = flattenVNodes(slots.default() ?? [])

      const firstNonCommentChildIndex = children.findIndex((child) => child.type !== Comment)

      if (firstNonCommentChildIndex === -1) return children

      const injectionTarget = children[firstNonCommentChildIndex]
      const omittedRefProps = omitRef(injectionTarget.props)
      const mergedProps = omittedRefProps ? mergeProps(attrs, omittedRefProps) : attrs

      const cloned = cloneVNode(injectionTarget, mergedProps, true)

      if (children.length === 1) return cloned

      return children.map((child, index) => {
        return index === firstNonCommentChildIndex ? cloned : child
      })
    }
  },
})

export default Injection
