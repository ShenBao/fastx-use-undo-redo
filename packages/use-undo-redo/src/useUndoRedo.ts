import { useReducer, useCallback, Reducer } from "react";

import { reducer } from "./reducer";

import type {
  Action,
  MutationBehavior,
  Options,
  State,
  UseUndoRedo,
} from "./types";

const initialState = {
  past: [],
  present: null,
  future: [],
};

const defaultOptions: Options = {
  behavior: "mergePastReversed",
  historyLimit: 100,
  ignoreIdenticalMutations: true,
  cloneState: false,
};

const compileMutateOptions = (options: Options) => ({
  ...defaultOptions,
  ...options,
});

const useUndoRedo = <T = any>(
  initialPresent: T,
  options: Options = defaultOptions
): UseUndoRedo<T> => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    present: initialPresent,
  });

  const canUndo = state.past.length !== 0;
  const canRedo = state.future.length !== 0;

  const undo = useCallback(() => {
    if (canUndo) {
      dispatch({ type: "undo" });
    }
  }, [canUndo]);

  const redo = useCallback(() => {
    if (canRedo) {
      dispatch({ type: "redo" });
    }
  }, [canRedo]);

  const reset = useCallback(
    (payload = initialPresent) => dispatch({ type: "reset", payload }),
    []
  );
  const resetInitialState = useCallback(
    (newInitialState: T, changePresent?: boolean) => dispatch({ type: "resetInitialState", payload: newInitialState, changePresent }),
    []
  );

  const update = useCallback(
    (payload: T, mutationBehavior: MutationBehavior, ignoreAction: boolean) =>
      dispatch({
        type: "update",
        payload,
        behavior: mutationBehavior,
        ignoreAction,
        ...compileMutateOptions(options),
      }),
    []
  );

  // We can ignore the undefined type error here because
  // we are setting a default value to options.
  const setState = useCallback(
    (
      payload: any,

      // @ts-ignore
      mutationBehavior: MutationBehavior = options.behavior,
      ignoreAction: boolean = false
    ) => {
      return update(payload, mutationBehavior, ignoreAction);
    },
    [state]
  );

  // In some rare cases, the fact that the above setState
  // function changes on every render can be problematic.
  // Since we can't really avoid this (setState uses
  // state.present), we must export another function that
  // doesn't depend on the present state (and thus doesn't
  // need to change).
  const static_setState = (
    payload: any,

    // @ts-ignore
    mutationBehavior: MutationBehavior = options.behavior,
    ignoreAction: boolean = false
  ) => {
    update(payload, mutationBehavior, ignoreAction);
  };

  return [
    state.present,
    setState,
    {
      past: state.past,
      future: state.future,

      undo,
      canUndo,
      redo,
      canRedo,

      reset,
      resetInitialState,
      static_setState,
    },
  ];
};

export default useUndoRedo;
