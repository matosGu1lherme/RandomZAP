import React, { useState, useEffect,  useRef} from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import * as C from "./styles";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import axios from 'axios';
import onLogin from '../Home/Chat';

const Signin = ({onLogin}) => {

  const { signin } = useAuth();
  const navigate = useNavigate();
  const webSocket = useRef(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [isLogged, setIsLogged] = useState(false);

  const handleLogin = async () => {
  
    if (!email || !senha) {
      setError("Preencha todos os campos");
      return;
    }

    try {
      const response = await axios.post('http://localhost:9000/users/login', {
        email: email,
        password: senha,
        isLogged: true,
      });
      await signin(email, senha);
      // Trate a resposta conforme necessário, armazene o token, redirecione, etc.
      const {user, token } = response.data;
      localStorage.setItem('user_token', JSON.stringify({ email, token }));
      //onLogin(user.nickname);
      //console.log(user.nickname);
      navigate("/home");
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro desconhecido';
      // Trate os erros de requisição
      setError(errorMessage);
    }
  };

  // Chame o handleLogin diretamente ou em algum evento, como um clique de botão
  useEffect(() => {
    handleLogin();
  }, []); // O segundo argumento (array vazio) significa que este efeito será executado uma vez após a montagem do componente

  return (
    <C.Container>
      <C.Label>SISTEMA DE LOGIN</C.Label>
      <C.Content>
        <Input
          type="email"
          placeholder="Digite seu E-mail"
          value={email}
          onChange={(e) => [setEmail(e.target.value), setError("")]}
        />
        <Input
          type="password"
          placeholder="Digite sua Senha"
          value={senha}
          onChange={(e) => [setSenha(e.target.value), setError("")]}
        />
        <C.labelError>{error}</C.labelError>
        <Button Text="Entrar" onClick={handleLogin} />
        <C.LabelSignup>
          Não tem uma conta?
          <C.Strong>
            <Link to="/signup">&nbsp;Registre-se</Link>
          </C.Strong>
        </C.LabelSignup>
      </C.Content>
    </C.Container>
  );
};

export default Signin;
