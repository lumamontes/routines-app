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

import { Observable } from "@legendapp/state";
import { useUnmountOnce } from "@legendapp/state/react";
import { useMemo } from "react";
import { createDraft } from "../utilities/createDraft";

export function useDraft<T extends Record<string, any>>(
  obs$: Observable<T>,
  options?: { createClone?: (t: T) => Partial<T> },
): Observable<T> {
  const { draft$, cleanup } = useMemo(() => createDraft(obs$, options), []);

  useUnmountOnce(cleanup);

  return draft$;
}
