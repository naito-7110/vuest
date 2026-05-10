import { inject, provide } from 'vue'
import type { InjectionKey } from 'vue'

export default function defineContext<ContextValue>(name: string) {
  const contextName = `${name}Context`
  const injectionKey: InjectionKey<ContextValue> = Symbol(contextName)

  function provideContext(contextValue: ContextValue) {
    provide(injectionKey, contextValue)
  }

  function useContext<T extends ContextValue>(fallback?: T) {
    const ctx = inject(injectionKey, fallback)

    if (ctx === undefined || ctx === null) {
      throw new Error(`${contextName} was not found.`)
    }

    return ctx
  }

  return {
    provideContext,
    useContext,
  } as const
}
