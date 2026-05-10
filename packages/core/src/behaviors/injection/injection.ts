import { Fragment, Comment, cloneVNode, defineComponent, mergeProps } from 'vue'
import type { VNode } from 'vue'

function flattenVNodes(children: VNode[]): VNode[] {
  if (!children) return []

  return children.flatMap((child) => {
    if (Array.isArray(child)) return flattenVNodes(child)

    if (child.type === Fragment) {
      return flattenVNodes(child.children as VNode[])
    }

    return [child]
  })
}

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
      const omitedRefProps = omitRef(injectionTarget.props)
      const mergedProps = omitedRefProps ? mergeProps(attrs, omitedRefProps) : attrs

      const cloned = cloneVNode(injectionTarget, mergedProps, true)

      if (children.length === 1) return cloned

      return children.map((child, index) => {
        return index === firstNonCommentChildIndex ? cloned : child
      })
    }
  },
})

export default Injection
