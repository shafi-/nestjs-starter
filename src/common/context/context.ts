import * as asyncHooks from 'async_hooks';

/**
 * If we create the hooks at this point, we have lots of calls even before
 * the App code starts to run.
 * So the hook is created here, but is initialized only when the `enable`
 * function is called.
 */
let hook: asyncHooks.AsyncHook;

const executionContextMap = new Map<number, Map<string, unknown>>();

function init(asyncId: number, type: string, triggerAsyncId: number): void {
  const parentContext = executionContextMap.get(triggerAsyncId);
  if (!parentContext) {
    return;
  }
  executionContextMap.set(asyncId, parentContext);
}

function destroy(asyncId): void {
  executionContextMap.delete(asyncId);
}

/**
 * Implementing as functions to avoid any binding
 * to a specific object or class that could become a leak.
 */
export function get<T>(key: string): T | null {
  const asyncId = asyncHooks.executionAsyncId();
  const context = executionContextMap.get(asyncId);
  if (!context) {
    return null;
  }
  return context.get(key) as T;
}

export function set<T>(key: string, value: T): void {
  const asyncId = asyncHooks.executionAsyncId();
  let context = executionContextMap.get(asyncId);
  if (!context) {
    context = new Map<string, unknown>();
    executionContextMap.set(asyncId, context);
  }
  context.set(key, value);
}

export function enable(): void {
  if (!hook) {
    hook = asyncHooks.createHook({ init, destroy });
  }
  hook.enable();
}

export function disable(): void {
  if (hook) {
    hook.disable();
  }
}
