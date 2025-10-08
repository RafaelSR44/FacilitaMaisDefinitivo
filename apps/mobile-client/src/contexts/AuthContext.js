import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { authService } from '../services/authService';

const AuthContext = createContext();

const initialState = {
  isLoading: true,
  isAuthenticated: false,
  user: null,
  token: null,
  refreshToken: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: !!action.token,
        token: action.token,
        refreshToken: action.refreshToken,
        user: action.user,
      };
    case 'SIGN_IN':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        token: action.token,
        refreshToken: action.refreshToken,
        user: action.user,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        token: null,
        refreshToken: null,
        user: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.user },
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.loading,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Restore authentication state on app start
    const bootstrapAsync = async () => {
      let token, refreshToken, user;

      try {
        // Try to get tokens from secure storage
        const credentials = await Keychain.getInternetCredentials('facilita_auth');
        if (credentials) {
          token = credentials.username; // We store token as username
          refreshToken = credentials.password; // And refresh token as password
        }

        // Get user data from AsyncStorage
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          user = JSON.parse(userData);
        }

        // Validate token
        if (token) {
          try {
            const response = await authService.validateToken(token);
            if (response.valid) {
              dispatch({ type: 'RESTORE_TOKEN', token, refreshToken, user });
              return;
            }
          } catch (error) {
            console.log('Token validation failed:', error);
          }
        }
      } catch (error) {
        console.log('Error restoring auth state:', error);
      }

      // If we get here, authentication failed
      dispatch({ type: 'RESTORE_TOKEN', token: null, refreshToken: null, user: null });
    };

    bootstrapAsync();
  }, []);

  const signIn = async (email, password) => {
    dispatch({ type: 'SET_LOADING', loading: true });
    
    try {
      const response = await authService.login(email, password);
      const { user, accessToken, refreshToken } = response;

      // Store tokens securely
      await Keychain.setInternetCredentials(
        'facilita_auth',
        accessToken,
        refreshToken
      );

      // Store user data
      await AsyncStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: 'SIGN_IN',
        token: accessToken,
        refreshToken,
        user,
      });

      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_LOADING', loading: false });
      return { 
        success: false, 
        error: error.message || 'Erro ao fazer login' 
      };
    }
  };

  const signUp = async (userData) => {
    dispatch({ type: 'SET_LOADING', loading: true });
    
    try {
      const response = await authService.register(userData);
      const { user, accessToken, refreshToken } = response;

      // Store tokens securely
      await Keychain.setInternetCredentials(
        'facilita_auth',
        accessToken,
        refreshToken
      );

      // Store user data
      await AsyncStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: 'SIGN_IN',
        token: accessToken,
        refreshToken,
        user,
      });

      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_LOADING', loading: false });
      return { 
        success: false, 
        error: error.message || 'Erro ao criar conta' 
      };
    }
  };

  const signOut = async () => {
    try {
      // Remove tokens from secure storage
      await Keychain.resetInternetCredentials('facilita_auth');
      
      // Remove user data
      await AsyncStorage.removeItem('user');

      // Call logout API
      if (state.token) {
        try {
          await authService.logout(state.token);
        } catch (error) {
          console.log('Logout API call failed:', error);
        }
      }
    } catch (error) {
      console.log('Error during sign out:', error);
    }

    dispatch({ type: 'SIGN_OUT' });
  };

  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', user: userData });
    // Update stored user data
    AsyncStorage.setItem('user', JSON.stringify({ ...state.user, ...userData }));
  };

  const refreshAuthToken = async () => {
    if (!state.refreshToken) {
      signOut();
      return false;
    }

    try {
      const response = await authService.refreshToken(state.refreshToken);
      const { accessToken, refreshToken } = response;

      // Update stored tokens
      await Keychain.setInternetCredentials(
        'facilita_auth',
        accessToken,
        refreshToken
      );

      dispatch({
        type: 'RESTORE_TOKEN',
        token: accessToken,
        refreshToken,
        user: state.user,
      });

      return true;
    } catch (error) {
      console.log('Token refresh failed:', error);
      signOut();
      return false;
    }
  };

  const value = {
    ...state,
    signIn,
    signUp,
    signOut,
    updateUser,
    refreshAuthToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
