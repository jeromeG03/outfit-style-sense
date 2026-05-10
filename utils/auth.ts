// Utility functions for authentication

export interface User {
  userId: number;
  userName: string;
  password?: string;
  gender: string;
  skinTone: string;
  age: number;
  createdAt: string;
}

export const getLoggedInUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const isLoggedIn = (): boolean => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

export const logout = (): void => {
  localStorage.removeItem('user');
  localStorage.removeItem('isLoggedIn');
};

export const getUserName = (): string | null => {
  const user = getLoggedInUser();
  return user ? user.userName : null;
};
