import { Fragment } from 'vue'
import type { VNode } from 'vue'

export function flattenVNodes(vnodes: VNode[]): VNode[] {
  if (!vnodes) return []

  return vnodes.flatMap((vnode) => {
    if (Array.isArray(vnode)) return flattenVNodes(vnode)

    if (vnode.type === Fragment) {
      return flattenVNodes(vnode.children as VNode[])
    }

    return [vnode]
  })
}
