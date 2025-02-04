// src/@types/react-native-async-storage.d.ts
declare module '@react-native-async-storage/async-storage' {
    interface AsyncStorageStatic {
      /**
       * Saves data to AsyncStorage
       * @param key The key under which the value will be stored
       * @param value The value to be stored
       */
      setItem(key: string, value: string): Promise<void>;
  
      /**
       * Retrieves the value for a given key
       * @param key The key to retrieve
       */
      getItem(key: string): Promise<string | null>;
  
      /**
       * Removes a specific key from AsyncStorage
       * @param key The key to remove
       */
      removeItem(key: string): Promise<void>;
  
      /**
       * Clears all data from AsyncStorage
       */
      clear(): Promise<void>;
  
      /**
       * Merges an object with the existing value for a given key
       * @param key The key to update
       * @param value The value to merge with the existing value
       */
      mergeItem(key: string, value: string): Promise<void>;
  
      /**
       * Gets the current length of AsyncStorage
       */
      length(): Promise<number>;
  
      /**
       * Gets all keys from AsyncStorage
       */
      getAllKeys(): Promise<string[]>;
  
      /**
       * Removes multiple items from AsyncStorage
       * @param keys The keys to remove
       */
      multiRemove(keys: string[]): Promise<void>;
  
      /**
       * Sets multiple items at once
       * @param pairs An array of key-value pairs to be set
       */
      multiSet(pairs: [string, string][]): Promise<void>;
  
      /**
       * Merges multiple items at once
       * @param pairs An array of key-value pairs to merge
       */
      multiMerge(pairs: [string, string][]): Promise<void>;
  
      /**
       * Retrieves multiple items at once
       * @param keys The keys to retrieve
       */
      multiGet(keys: string[]): Promise<[string, string | null][]>;
  
      /**
       * Checks if the key exists in AsyncStorage
       * @param key The key to check
       */
      contains(key: string): Promise<boolean>;
    }
  
    const AsyncStorage: AsyncStorageStatic;
    export default AsyncStorage;
  }
  