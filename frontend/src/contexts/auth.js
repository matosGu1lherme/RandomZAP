import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
     
    // Configuração global do Axios para adicionar o token ao cabeçalho de autorização
     const token = localStorage.getItem('user_token');
     console.log('Token recebido:', token);
     if (token) {
       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
     }
     console.log(user);

  }, [user]);

  const signin = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:9000/users/login', { email, password });
      const { user, token } = response.data;
      
      console.log('Resposta do servidor:', response.data);
  
      localStorage.setItem('user_token', token);
      setUser(user);
  
    } catch (error) {
      console.error('Erro durante o login:', error);
      return "Erro durante o login";
    }
  };

  const signup = (email, password) => {
    const usersStorage = JSON.parse(localStorage.getItem("users_bd"));

    const hasUser = usersStorage?.filter((user) => user.email === email);

    if (hasUser?.length) {
      return "Já tem uma conta com esse E-mail";
    }

    let newUser;

    if (usersStorage) {
      newUser = [...usersStorage, { email, password }];
    } else {
      newUser = [{ email, password }];
    }

    localStorage.setItem("users_bd", JSON.stringify(newUser));

    return;
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem("user_token");
    axios.defaults.headers = { ...axios.defaults.headers, common: {} };;
  };

  return (
    <AuthContext.Provider
      value={{ user, signed: !!user, signin, signup, signout }}
    > 
      {children}
    </AuthContext.Provider>
  );
};