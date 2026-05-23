export function isHTMLTagName<ExpectedTagName extends keyof HTMLElementTagNameMap>(
  tag: string,
  expected: ExpectedTagName,
): tag is ExpectedTagName {
  return tag === expected
}
