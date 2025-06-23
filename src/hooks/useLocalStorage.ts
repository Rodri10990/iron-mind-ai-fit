
import { useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        const { value } = await Preferences.get({ key });
        if (value) {
          setStoredValue(JSON.parse(value));
        }
      } catch (error) {
        console.error(`Error loading ${key} from storage:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredValue();
  }, [key]);

  const setValue = async (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      await Preferences.set({
        key,
        value: JSON.stringify(valueToStore),
      });
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
    }
  };

  return [storedValue, setValue, isLoading] as const;
};
