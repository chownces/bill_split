import { useToast } from '@chakra-ui/react';
import React from 'react';

export function useLocalStorageState<T>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = React.useState<T>(() => {
    const localStorageValue = window.localStorage.getItem(key);
    return localStorageValue ? JSON.parse(localStorageValue) : defaultValue;
  });

  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export function useErrorToast() {
  const toast = useToast();

  const showErrorToast = (msg: string) => {
    toast({
      description: msg,
      status: 'error',
      duration: 3000,
      isClosable: true
    });
  };

  return showErrorToast;
}
