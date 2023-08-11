import { Dispatch, useReducer } from "react";

export default function useFlatReducer<T>(initial: T): [T, Dispatch<Partial<T>>] {
    return useReducer( (value: T, update: Partial<T>): T => {
        return { ...value, ...update };
    }, initial);
}
