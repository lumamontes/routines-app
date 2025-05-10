/**
 * Legend Kit - A collection of utilities for Legend State, Legend List, and Legend Motion
 * https://legendapp.com/kit/
 *
 * [PRO] This is a premium feature of Legend Kit
 * Requires a Legend Kit Pro subscription to use in production
 *
 * Part of the Legend Kit ecosystem
 * See LICENSE file in https://github.com/LegendApp/legend-kit for more information
 */

import {
  Observable,
  applyChanges,
  internal,
  isObject,
  mergeIntoObservable,
  observable,
} from "@legendapp/state";

const { clone } = internal;

export function createDraft<T extends Record<string, any>>(
  obs$: Observable<T>,
  options?: { createClone?: (t: T) => Partial<T> },
): { draft$: Observable<T>; cleanup: () => void } {
  const createClone = options?.createClone || ((v) => clone(v));
  // Create a draft observable
  const draft$ = observable<T>(() => createClone(obs$.get()));

  // Listen for changes on the target observable
  const cleanup = obs$.onChange(({ changes, isFromSync, value }) => {
    // If this change on the target observable is remote then
    // we need to merge the changes into the draft
    if (isFromSync) {
      // Clone the current draft value so that applying changes acts on a fresh object
      const toSave = clone(draft$.peek());
      if (toSave && isObject(toSave)) {
        // Apply the incoming changes into the draft
        applyChanges(toSave, changes);
        mergeIntoObservable(draft$ as Observable<any>, toSave);
      } else {
        // If draft is currently empty then just set it to the current value of the target observable
        draft$.set(createClone(value) as T);
      }
    }
  });

  return { draft$, cleanup };
}
