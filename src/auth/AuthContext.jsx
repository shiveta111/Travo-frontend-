import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';


const AuthContext =
  createContext();


export const AuthProvider = ({
  children
}) => {

  const [user, setUser] =
    useState(null);

  const [accessToken,
    setAccessToken] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);


  useEffect(() => {

    const storedUser =
      sessionStorage.getItem(
        'user'
      );

    const storedToken =
      sessionStorage.getItem(
        'accessToken'
      );


    if (
      storedUser &&
      storedToken
    ) {

      setUser(
        JSON.parse(
          storedUser
        )
      );

      setAccessToken(
        storedToken
      );

    }


    setLoading(false);

  }, []);


  const login = (
    userData,
    token
  ) => {

    setUser(userData);

    setAccessToken(token);


    sessionStorage.setItem(
      'user',
      JSON.stringify(
        userData
      )
    );


    sessionStorage.setItem(
      'accessToken',
      token
    );

  };


  const logout = () => {

    setUser(null);

    setAccessToken(null);


    sessionStorage.removeItem(
      'user'
    );

    sessionStorage.removeItem(
      'accessToken'
    );

  };


  return (

    <AuthContext.Provider

      value={{

        user,

        accessToken,

        login,

        logout,

        loading,

        isAuthenticated:
          !!accessToken

      }}

    >

      {children}

    </AuthContext.Provider>

  );

};


export const useAuth =
  () => useContext(AuthContext);