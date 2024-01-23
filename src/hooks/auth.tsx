import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  loading: boolean;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function AuthProvider({ children }: React.PropsWithChildren) {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoredData(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        '@GoBarber:token',
        '@GoBarber:user',
      ]);

      if (token[1] && user[1]) {
        api.defaults.headers.authorization = `Bearer ${token[1]}`;

        const newUser = updateUserImageUrl(JSON.parse(user[1]));

        setData({ token: token[1], user: newUser });
      }

      setLoading(false);
    }

    loadStoredData();
  }, []);

  const signIn = useCallback(async ({ email, password }: SignInCredentials) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    await AsyncStorage.multiSet([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(user)],
    ]);

    api.defaults.headers.authorization = `Bearer ${token}`;

    const newUser = updateUserImageUrl(user);

    setData({ token, user: newUser });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@GoBarber:user', '@GoBarber:token']);

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    async (user: User) => {
      await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user));

      const newUser = updateUserImageUrl(user);

      setData({
        token: data.token,
        user: newUser,
      });
    },
    [data.token],
  );

  function updateUserImageUrl(user: User): User {
    return {
      ...user,
      avatar_url: user.avatar_url,
    };
  }

  const values = useMemo(() => {
    return {
      user: data.user,
      signIn,
      signOut,
      loading,
      updateUser,
    };
  }, [data.user, signIn, signOut, loading, updateUser]);

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('UseAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
