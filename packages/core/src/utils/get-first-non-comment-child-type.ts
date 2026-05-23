import type { VNode } from 'vue'
import { Comment } from 'vue'
import { flattenVNodes } from './flatten-vnodes'

export function getFirstNonCommentChildElementTypeName(
  slots: VNode[],
): keyof HTMLElementTagNameMap | undefined {
  const children = flattenVNodes(slots)

  const firstNonCommentChildIndex = children.findIndex((child) => child.type !== Comment)

  if (firstNonCommentChildIndex === -1) return undefined

  const firstNonCommentChild = children[firstNonCommentChildIndex]

  return firstNonCommentChild.type as keyof HTMLElementTagNameMap
}
