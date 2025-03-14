import type { Callback, CallbackParams } from '../utils';

export type ListenerParams = CallbackParams;
export type Listener = Callback;

/**
 * Dispatch options.
 */
export interface DispatchInit {}

/**
 * Dispatch Object.
 */
export interface DispatchApi {
  /**
   * Add listener.
   *
   * @param key identifier. It is recommended to obtain it through the `seqId` method. {@link src/utils/Sequence.ts}
   * @param listener {@link Listener}
   */
  addListener(key: string, listener: Listener): void;
  /**
   * Remove listener.
   * @param key identifier. It is recommended to obtain it through the `seqId` method. {@link src/utils/Sequence.ts}
   * @param listener {@link Listener}
   */
  removeListener(key: string, listener: Listener): void;
  /**
   * Asynchronous notification method. All listeners will receive notifications corresponding to `key`.
   * @param key identifier.
   * @param args any.
   */
  emit(key: string, ...args: any[]): void;
  /**
   * Synchronous notification method. All listeners will receive notifications corresponding to `key`.
   * @param key identifier.
   * @param args any.
   */
  emitSync(key: string, ...args: any[]): void;
}
