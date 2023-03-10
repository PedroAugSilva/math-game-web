import { useEffect, useState, Dispatch, SetStateAction } from "react";

type TResponse<T> = [T, Dispatch<SetStateAction<T>>];

const usePersistedState = <T>(key: string, initialState: any): TResponse<T> => {
  const [state, setState] = useState(() => {
    const hasStorage = JSON.parse(localStorage.getItem(key)!);
    if (hasStorage) {
      return hasStorage;
    } else {
      return initialState;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};

export default usePersistedState;
