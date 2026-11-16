import { useState, useEffect, useCallback } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage';

/**
 * Custom hook to keep React state synchronized with localStorage.
 * Automatically updates when other components trigger updates or across browser tabs.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    return getStorageItem(key, initialValue);
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        setStorageItem(key, valueToStore);
      } catch (error) {
        console.error(`[useLocalStorage] Error updating key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        setStoredValue(getStorageItem(key, initialValue));
      }
    };

    const handleCustomEvent = () => {
      setStoredValue(getStorageItem(key, initialValue));
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('quotevault_storage_changed', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('quotevault_storage_changed', handleCustomEvent);
    };
  }, [key, initialValue]);

  return [storedValue, setValue];
}
