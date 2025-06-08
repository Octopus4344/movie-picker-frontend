import React from "react";

const useLocalStorage = <T,>(key: string, defaultValue: T) => {
  const [value, setValue] = React.useState<T>(defaultValue);
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    const item = window.localStorage.getItem(key);
    if (item !== null && item !== undefined && item !== "") {
      try {
        setValue(JSON.parse(item) as T);
      } catch (error) {
        console.warn(`Error parsing localStorage key "${key}":`, error);
        setValue(defaultValue);
      }
    } else {
      setValue(defaultValue);
    }
    setIsLoading(false);
  }, [key, defaultValue]);
  const setNewValue = (newValue: T) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };
  return { value, setNewValue, isLoading };
};

export { useLocalStorage };
