import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

// Stockage chiffre du telephone (SecureStore). Sur le web (tests en developpement), stockage du navigateur.
export const storage =
  Platform.OS === 'web'
    ? {
        get: async (key) => window.localStorage.getItem(key),
        set: async (key, value) => window.localStorage.setItem(key, value),
        remove: async (key) => window.localStorage.removeItem(key),
      }
    : {
        get: (key) => SecureStore.getItemAsync(key),
        set: (key, value) => SecureStore.setItemAsync(key, value),
        remove: (key) => SecureStore.deleteItemAsync(key),
      }
