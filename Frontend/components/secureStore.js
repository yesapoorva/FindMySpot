import * as SecureStore from 'expo-secure-store';

const USER_TOKEN_KEY = 'userToken';

export const storeUserToken = async (token) => {
  try {
    await SecureStore.setItemAsync(USER_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error storing user token:', error);
  }
};

export const getUserToken = async () => {
  try {
    const token = await SecureStore.getItemAsync(USER_TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('Error reading user token:', error);
    return null;
  }
};

export const deleteUserToken = async () => {
  try {
    await SecureStore.deleteItemAsync(USER_TOKEN_KEY);
  } catch (error) {
    console.error('Error deleting user token:', error);
  }
};
