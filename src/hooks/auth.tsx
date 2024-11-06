import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}


interface IAuthContextData {
  user: User;
  userStorageLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
}

interface AuthorizationResponse {
  params: {
    access_token: string;
  },
  type: string;
}

const AuthContext = createContext({} as IAuthContextData);

const AuthProvider = ({children}: AuthProviderProps) => {
  const [user,setUser] = useState<User>({} as User);
  const [userStorageLoading, setUserStorageLoading] = useState(true);

  const userStorageKey = '@gofinances:user';
 
  async function signInWithGoogle(){
    try {
      const RESPONSE_TYPE = 'token';
      const SCOPE = encodeURI('profile email');

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

      const {type, params} = 
        await AuthSession.startAsync({authUrl}) as AuthorizationResponse;
      if(type === 'success'){
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
        const userInfo = await response.json();

        const dataUser = { 
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          photo: userInfo.picture
        }

        setUser(dataUser);
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(dataUser));
      }

    } catch(error: any) {
      throw new Error(error);
    }
  }

  async function signInWithApple(){
    try {
      const credentials = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ]
      });

      if(credentials) {
        const name = credentials.fullName?.givenName!;
        const dataUser = {
          id: String(credentials.user),
          email: credentials.email!,
          name,
          photo: `https://ui-avatars.com/api/?name=${name}&length=1`
        };

        setUser(dataUser);
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(dataUser));
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async function signOut() {
    setUser({} as User);
    await AsyncStorage.removeItem(userStorageKey);
  }

  useEffect(() => {
    async function loadUserStorageDate() {
      const userStorage = await AsyncStorage.getItem(userStorageKey);
      if(userStorage) {
        setUser(JSON.parse(userStorage) as User);
      }
      setUserStorageLoading(false);
    }

    loadUserStorageDate();
  }, []);

  return(
    <AuthContext.Provider value={{
        user, 
        userStorageLoading,
        signInWithGoogle, 
        signInWithApple, 
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function useAuth(){
  const context = useContext(AuthContext);
  return context;
}

export {AuthProvider, useAuth};